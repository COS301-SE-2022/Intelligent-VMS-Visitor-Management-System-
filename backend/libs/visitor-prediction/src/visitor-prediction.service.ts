import { Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';
import training from './visitor-prediction_training.json';
import testing from './visitor-prediction_testing.json';

@Injectable()
export class VisitorPredictionService {
    async NN(){
       /* // convert/setup our data
        const trainingData = tf.tensor2d(training.map((item: { sepal_length: any; sepal_width: any; petal_length: any; petal_width: any; }) => [
            item.sepal_length, item.sepal_width, item.petal_length, item.petal_width,
        ]))
        const outputData = tf.tensor2d(training.map(item => [
            item.species === "setosa" ? 1 : 0,
            item.species === "virginica" ? 1 : 0,
            item.species === "versicolor" ? 1 : 0,
        ]))
        const testingData = tf.tensor2d(testing.map(item => [
            item.sepal_length, item.sepal_width, item.petal_length, item.petal_width,
        ]))
        
        // build neural network
        const model = tf.sequential()
        
        model.add(tf.layers.dense({
            inputShape: [4],
            activation: "sigmoid",
            units: 5,
        }))
        model.add(tf.layers.dense({
            inputShape: [5],
            activation: "sigmoid",
            units: 3,
        }))
        model.add(tf.layers.dense({
            activation: "sigmoid",
            units: 3,
        }))
        model.compile({
            loss: "meanSquaredError",
            optimizer: tf.train.adam(.06),
        })
        // train/fit our network
        const startTime = Date.now()
        model.fit(trainingData, outputData, {epochs: 100})
            .then((history) => {
            // console.log(history)
            console.log(model.predict(testingData))
            })
            */
    }
}
