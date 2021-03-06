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

/**
 * SQL module
 * @module eclairjs/sql/types
 */
module.exports = function(kernelP) {
  return {
    ArrayType: require('./ArrayType.js')(kernelP),
    DataTypes: require('./DataTypes.js')(kernelP),
    Metadata: require('./Metadata.js'),
    StructField: require('./StructField.js')(kernelP),
    StructType: require('./StructType.js')(kernelP)
  };
};