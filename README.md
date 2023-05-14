# :warning: Warning

This project have been deprecated and might no longer work with the latest version of the [Wonderland Engine](https://wonderlandengine.com/).

An updated version of this feature can be found in the [PP library](https://github.com/SignorPipo/wle_pp).

You can also find a similar template project [here](https://github.com/SignorPipo/wle_pplaygrounds#pplayground).

# 

<p align="center">
<br>
<img src="https://github.com/SignorPipo/wle_grab_throw/blob/main/extra/showdonttell.gif">
</p>

## Overview
A showcase of the Grab & Throw feature for the Wonderland Engine

### Tricks
  - Use the right controller top button to make the grabbed object snap on the hand
  - Use the left controller top button to force emulated velocities instead of the XRPose ones
    - Can be used to test how the throw would behave when XRPose velocities are not available

## How to import
  - Import the `pp` folder into your `project` folder, along with all the subfolders (you can avoid importing the `tool` folder)
    - This `pp` folder should only contain the `pp.js` file, apart for other folders
    - You must link this folder in the Java Script Sources list (under Project Settings) before any other folders that contain scripts that use the `PP` namespace
    - This is needed to make sure the `PP` namespace is created before it is used 
    - If you put it as first (after `/js/components/`) you should be safe
  - Add the `grab` component to one of the hands
    - `_myHandedness`: the handedness of the hand
    - `_mySnapOnPivot`: specify if you want the grabbed object to snap on the pivot
    - If you want to offset the pivot, just put the grab component in an object child of the hand and offset that 
    - The same object must also have a `collision` component that will be used as a trigger to know if a grabbable is close
  - Add the `grabbable` component to an object
    - This object must have a `collision` component used as a trigger for the grab
    - The object must also have a `physx` component used to add the velocities when thrown
      - If the object does not move after being grabbed add to it the `fix-physx-kinematic-parent` component you can find in the `cauldron` folder

## License
You are free to use this in your projects, just remember to credit me somewhere!

## Credits
Oculus Quest Controller Models by Jezza3D on Sketchfab with small adjustments made by me.

Watermelon model done by Florian with love <3
