# License Plate Recognition System (Backend)

This project is an implementation of an Automatic License Plate Recognition (ALPR) system that can be used to monitor and track vehicles entering a designated area. The system uses computer vision techniques to detect motion in a video feed and then extracts license plate information from the captured frames using the OpenALPR library. The system can then send the extracted information to a backend server for further processing.

## Features

- Detects motion in a video feed and captures the frames where motion is detected.
- Extracts license plate information from the captured frames using OpenALPR.
- Sends the extracted information to a backend server for further processing.
- Displays the captured frames in real-time.
- Runs on Linux, macOS and Windows.

## Requirements

- OpenCV 4.5.3 or later
- OpenALPR 2.3.0 or later
- Python 3.6 or later
- Node.js 14.0 or later
- MySQL

## Installation

Clone the repository:

```bash
    git clone https://github.com/MalakAbbassi/capstone-backend.git
```
    

Install the required packages for Python:
```bash
    pip install -r raspberry_pi/requirements.txt
```
Install the required packages for Node.js:
```bash
    npm install
```

##### Install OpenCV:

- macOS
```bash
    brew install opencv
    
```
- Windows
```bash
    pip install opencv-python-headless
```
- Linux
```bash
    sudo apt install libopencv-dev python3-opencv
```

##### Install OpenALPR:
- macOS

```bash
    brew install openalpr
```

- Linux
```bash
    sudo apt install openalpr
```

- Windows
    Download the OpenALPR installer from the [OpenALPR repository](https://github.com/openalpr/openalpr/releases) and follow the installation instructions.


Create a MySQL database and update the connection details in the index.js file.

### Usage

Start the backend server:

    npm start

Start the ALPR system:

    python motion.py

### Contributing

Contributions to this project are welcome. If you would like to contribute, please create a pull request with your changes.

### Notes

This repository is a part of a larger project, and works in tandem with the [LPRS (Frontend)](https://github.com/MalakAbbassi/capstone-frontend)

### Group Members

Malak Abbassi, Giorgi Samushia, Andrew Kulp