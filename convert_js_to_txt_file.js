// This node script imports the "modeledHRTFData" variable which is declared in
// the "modeledHRTFData.js" file, which contains an array of objects, and
// converts it to a text file.
//
// The modeledHRTFData array have the following structure:
// [
//     {
//         'azimuth': 0,
//         'distance': 1,
//         'elevation': -40,
//         'itd': 0,
//         'iir_coeffs_left': [
//           0.65549,
//           -1.7477,
//           0.88655,
//           -1.7006,
//           0.83541,
//           -1.2725,
//           0.85948,
//           -1.3682,
//           0.71943,
//           -1.9479,
//           0.95212,
//           -1.9484,
//           0.95334,
//           -1.9382,
//           0.96228,
//           -1.9422,
//           0.96604,
//           -0.53165,
//           0.8805,
//           -0.7819,
//           0.78236,
//           -0.14235,
//           0.43518,
//           0.10004,
//           0.78684,
//         ],
//         'iir_coeffs_right': [
//           0.65549,
//           -1.7477,
//           0.88655,
//           -1.7006,
//           0.83541,
//           -1.2725,
//           0.85948,
//           -1.3682,
//           0.71943,
//           -1.9479,
//           0.95212,
//           -1.9484,
//           0.95334,
//           -1.9382,
//           0.96228,
//           -1.9422,
//           0.96604,
//           -0.53165,
//           0.8805,
//           -0.7819,
//           0.78236,
//           -0.14235,
//           0.43518,
//           0.10004,
//           0.78684,
//         ],
//       },
//         ...
// ]
//
// The script will create a new file named "modeledHRTFData.txt" in the same
// directory as this script, containing the modeledHRTFData in the following
// format:
// azimuth elevation x y z itd iir_coeffs_left iir_coeffs_right;
//
// azimuth: azimuth angle in degrees, from -180 to 180. 0 is the front, points
//          to the positive x-axis. Positive values are to the right, negative
//          values are to the left: 90 is the right ear, -90 is the left ear,
//          180 is the back.
// elevation: elevation angle in degrees, from -40 to 90. 0 is the horizontal
//            plane. Positive values are up, negative values are down.
// x: cos(elevation) * cos(azimuth)
// y: -cos(elevation) * sin(azimuth)
// z: sin(elevation)
// itd: interaural time difference in milisseconds
// iir_coeffs_left: array of 25 IIR coefficients for the left ear, where the
//                  first is the gain coefficient and the rest are the
//                  coefficients for a biquad filter, in the following order:
//                  b1_n b2_n -a1_n -a2_n b1_n+1 b2_n+1 -a1_n+1 -a2_n+2 ...
// iir_coeffs_right: array of 25 IIR coefficients for the right ear, where the
//                   first is the gain coefficient and the rest are the
//                   coefficients for a biquad filter, in the following order:
//                   b1_n b2_n -a1_n -a2_n b1_n+1 b2_n+1 -a1_n+1 -a2_n+2 ...
//
// The script will overwrite the file if it already exists.
//
// Usage:
// $ node convert_js_to_txt_file.js
//
// The script will output the following message:
// "modeledHRTFData.txt file created successfully!"
//

const fs = require('fs');
const path = require('path');

const modeledHRTFData = require('./modeledHRTFData.js');

const outputFilePath = path.join(__dirname, 'modeledHRTFData.txt');

const outputData = modeledHRTFData.map((data) => {
    const azimuth = data.azimuth;
    const elevation = data.elevation;
    const x = Math.cos(elevation * Math.PI / 180) * Math.cos(azimuth * Math.PI / 180);
    const y = -Math.cos(elevation * Math.PI / 180) * Math.sin(azimuth * Math.PI / 180);
    const z = Math.sin(elevation * Math.PI / 180);
    const itd = data.itd;
    const iir_coeffs_left = data.iir_coeffs_left.join(' ');
    const iir_coeffs_right = data.iir_coeffs_right.join(' ');
    
    return `${azimuth} ${elevation} ${x} ${y} ${z} ${itd} ${iir_coeffs_left} ${iir_coeffs_right};`;
    });

fs.writeFileSync(outputFilePath, outputData.join('\n'));

console.log('modeledHRTFData.txt file created successfully!');

module.exports = {
    outputFilePath,
    outputData,
};

// EOF