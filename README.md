# binauralModeled-pd - An efficient binaural spatializer

The "binauralModeled-ircam" object is a pure-vanilla implementation of the [binaural model created at IRCAM.](https://github.com/Ircam-RnD/binauralModeled/).

The object is found at my repository: https://github.com/andresbrocco/binauralModeled-pd

## Main concept

Basically, it applies ITD and approximates the HRTF to a series of biquad filters, whose coefficients are avaliable [here](https://github.com/Ircam-RnD/binauralModeled/blob/gh-pages/examples/snd/complete_hrtf_modeled.js).

Sample Rate limitation: those coefficients work for audio at 44100Hz only!

### Space interpolation

There is no interpolation in space (between datapoints): the chosen set of coefficients for the HRTF is the closest datapoint to the given azimuth and elevation (by euclidean distance).

### Time interpolation

There is interpolation in time (so that a moving source sound smooth): two binauralModels run concurrently, and the transition is made by alternating which one to use (previous/current). That transition occurs in 20ms, whenever a new location is received.

### Interface

You can control the Azimuth and Elevation through the interface, or pass them as argument to the first inlet.

![image.png](/screenshot.png) 

### Performace

Obs.: If the Azimuth and elevation does not match exactly the coordinates of a point in the dataset of HRTFs, the object will perform a search by distance, which is not optimal. Therefore, if this object is embedded in a higher level application and you are concerned about performance, you should implement a k-d tree search in order to find the exact datapoint before passing it to the "binauralModeled-ircam" object.

Ah, maybe this statement is obvious, but: it only works with headphones!