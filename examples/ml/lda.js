/*
 * Copyright 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function exit() {
  process.exit();
}

function stop(e) {
  if (e) {
    console.log(e);
  }
  sc.stop().then(exit).catch(exit);
}

var spark = require('../../lib/index.js');

var k = 3;

function run(sc) {
  return new Promise(function(resolve, reject) {
    var sqlContext = new spark.sql.SQLContext(sc);

    var points = sc.textFile(__dirname + '/../mllib/data/sample_lda_data.txt').map(function(line, RowFactory, Vectors) {
      var tok = line.split(" ");
      var point = [];
      for (var i = 0; i < tok.length; ++i) {
        point[i] = parseFloat(tok[i]);
      }
      var points = Vectors.dense(point);
      return RowFactory.create(points);
    }, [spark.sql.RowFactory, spark.mllib.linalg.Vectors]);


    var fields = [new spark.sql.types.StructField("features", new spark.mllib.linalg.VectorUDT(), false, spark.sql.types.Metadata.empty())];
    var schema = new spark.sql.types.StructType(fields);
    var dataset = sqlContext.createDataFrame(points, schema);

    // Trains a LDA model
    var lda = new spark.ml.clustering.LDA()
      .setK(10)
      .setMaxIter(10);

    var model = lda.fit(dataset);

    var promises = [];
    promises.push(model.logLikelihood(dataset));
    promises.push(model.logPerplexity(dataset));

    Promise.all(promises).then(resolve).catch(reject);
  });
}

if (global.SC) {
  // we are being run as part of a test
  module.exports = run;
} else {
  var sc = new spark.SparkContext("local[*]", "LDA");
  run(sc).then(function(results) {
    console.log('logLikelihood', results[0]);
    console.log('logPerplexity', results[1]);
    stop();
  }).catch(stop);
}