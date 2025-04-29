
import * as tf from '@tensorflow/tfjs';

// LSTM model for stock price prediction
export class StockLSTM {
    constructor(config = {}) {
        // Default configuration
        this.config = {
            sequenceLength: 10,      // Number of time steps to look back
            epochs: 50,              // Training epochs
            batchSize: 32,           // Batch size for training
            units: 50,               // LSTM units
            dropoutRate: 0.2,        // Dropout rate for regularization
            learningRate: 0.001,     // Learning rate
            ...config                // Override with provided config
        };

        this.model = null;         // TensorFlow.js model
        this.minPrice = 0;         // For denormalization
        this.maxPrice = 0;         // For denormalization
    }

    // Build LSTM model
    buildModel(inputShape) {
        const model = tf.sequential();

        // Add LSTM layer
        model.add(tf.layers.lstm({
            units: this.config.units,
            returnSequences: false,
            inputShape: inputShape
        }));

        // Add dropout for regularization
        model.add(tf.layers.dropout({ rate: this.config.dropoutRate }));

        // Add output layer
        model.add(tf.layers.dense({ units: 1 }));

        // Compile model
        model.compile({
            optimizer: tf.train.adam(this.config.learningRate),
            loss: 'meanSquaredError'
        });

        this.model = model;
        return model;
    }

    // Preprocess data for LSTM
    preprocessData(data) {
        // Extract close prices and optionally sentiment
        const closePrices = data.map(item => item.close);
        const hasSentiment = data[0].sentiment !== undefined;

        // Get min and max for normalization
        this.minPrice = Math.min(...closePrices);
        this.maxPrice = Math.max(...closePrices);

        // Normalize prices to [0,1] range
        const normalizedPrices = closePrices.map(
            price => (price - this.minPrice) / (this.maxPrice - this.minPrice)
        );

        // Create sequences for LSTM
        const sequences = [];
        const targets = [];

        for (let i = 0; i < normalizedPrices.length - this.config.sequenceLength; i++) {
            // For each time step, create a sequence of past prices
            const seq = normalizedPrices.slice(i, i + this.config.sequenceLength);

            // Add sentiment if available
            if (hasSentiment) {
                // Normalize sentiment to [0,1] range and add as a feature
                const normalizedSentiment = (data[i + this.config.sequenceLength].sentiment + 1) / 2;
                seq.push(normalizedSentiment);
            }

            sequences.push(seq);
            targets.push(normalizedPrices[i + this.config.sequenceLength]);
        }

        return {
            sequences,
            targets,
            normalizedPrices,
            originalPrices: closePrices
        };
    }

    // Train the model (not used in the demo, but included for completeness)
    async train(sequences, targets) {
        if (!this.model) {
            this.buildModel([sequences[0].length, 1]);
        }

        // Convert to tensors
        const xs = tf.tensor3d(sequences, [sequences.length, sequences[0].length, 1]);
        const ys = tf.tensor2d(targets, [targets.length, 1]);

        // Train model
        await this.model.fit(xs, ys, {
            epochs: this.config.epochs,
            batchSize: this.config.batchSize,
            shuffle: true,
            validationSplit: 0.1
        });

        // Clean up tensors
        xs.dispose();
        ys.dispose();
    }

    // Make predictions using a simplified LSTM simulation
    predict(lastSequence, sentimentScores, days = 30) {
        // For demo purposes, simulate LSTM prediction
        // In a real app, this would use the trained model

        let currentSequence = [...lastSequence];
        const predictions = [];

        for (let i = 0; i < days; i++) {
            // Simple prediction logic with some randomness and sentiment influence
            const lastValues = currentSequence.slice(0, this.config.sequenceLength);
            const lastValue = lastValues[lastValues.length - 1];

            // Get sentiment for this day, or use the last one
            const sentimentValue = sentimentScores[i] !== undefined ?
                sentimentScores[i] :
                sentimentScores[sentimentScores.length - 1];

            // Calculate trend factor (direction and strength of trend)
            const trend = (lastValues[lastValues.length - 1] - lastValues[0]) / lastValues.length;

            // Sentiment influence (positive sentiment pushes prices up)
            const sentimentFactor = sentimentValue * 0.02;

            // Random noise
            const noise = (Math.random() - 0.5) * 0.01;

            // Calculate next value
            const nextValue = lastValue + trend + sentimentFactor + noise;

            // Ensure the value stays between 0 and 1 (normalized range)
            const boundedValue = Math.max(0, Math.min(1, nextValue));

            predictions.push(boundedValue);

            // Update sequence for next prediction
            currentSequence.shift();
            currentSequence.push(boundedValue);
        }

        // Denormalize predictions back to original price scale
        return predictions.map(
            pred => pred * (this.maxPrice - this.minPrice) + this.minPrice
        );
    }

    // Calculate evaluation metrics
    evaluateModel(actual, predicted) {
        // Root Mean Square Error (RMSE)
        const squaredDiffs = actual.map((val, i) => Math.pow(val - predicted[i], 2));
        const rmse = Math.sqrt(squaredDiffs.reduce((sum, val) => sum + val, 0) / actual.length);

        // R-squared (R²)
        const actualMean = actual.reduce((sum, val) => sum + val, 0) / actual.length;
        const totalSumSquares = actual.map(val => Math.pow(val - actualMean, 2))
            .reduce((sum, val) => sum + val, 0);
        const residualSumSquares = squaredDiffs.reduce((sum, val) => sum + val, 0);
        const r2 = 1 - (residualSumSquares / totalSumSquares);

        // F1 Score (for directional accuracy)
        // Convert continuous values to binary direction (up=1, down=0)
        const actualDirections = [];
        const predictedDirections = [];

        for (let i = 1; i < actual.length; i++) {
            actualDirections.push(actual[i] > actual[i - 1] ? 1 : 0);
            predictedDirections.push(predicted[i] > predicted[i - 1] ? 1 : 0);
        }

        // Calculate precision and recall for F1
        let truePositives = 0, falsePositives = 0, falseNegatives = 0;

        for (let i = 0; i < actualDirections.length; i++) {
            if (actualDirections[i] === 1 && predictedDirections[i] === 1) truePositives++;
            if (actualDirections[i] === 0 && predictedDirections[i] === 1) falsePositives++;
            if (actualDirections[i] === 1 && predictedDirections[i] === 0) falseNegatives++;
        }

        const precision = truePositives / (truePositives + falsePositives) || 0;
        const recall = truePositives / (truePositives + falseNegatives) || 0;
        const f1 = 2 * (precision * recall) / (precision + recall) || 0;

        return {
            rmse: rmse.toFixed(2),
            r2: r2.toFixed(2),
            f1: f1.toFixed(2)
        };
    }
}