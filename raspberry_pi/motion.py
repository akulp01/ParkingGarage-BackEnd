import cv2
import subprocess
import json
import requests
import base64

BACKEND_URL = "http://localhost:8081/checkpermit"
ENTERING = True
X, Y, WIDTH, HEIGHT = 100, 450, 450, 700
VIDEO_SOURCE = 'vid1.mp4'

def frame_diff(prev_frame, cur_frame):
    # Convert the frames to grayscale
    prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
    cur_gray = cv2.cvtColor(cur_frame, cv2.COLOR_BGR2GRAY)

    # Compute the absolute difference between the current frame and the previous frame
    frame_diff = cv2.absdiff(cur_gray, prev_gray)

    # Apply thresholding to the difference image
    ret, thresh = cv2.threshold(frame_diff, 30, 255, cv2.THRESH_BINARY)

    # Find contours in the thresholded image
    contours, hierarchy = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Filter out small contours
    filtered_contours = []
    for c in contours:
        if cv2.contourArea(c) > 5000:  # adjust the threshold value as per your requirement
            filtered_contours.append(c)
    return filtered_contours

def process_frame(roi, frame, candidates):
        image_data = cv2.imencode('.jpg', roi)[1].tobytes()
        output = subprocess.check_output(['alpr', '-j', '-c', 'us', '-'], input=image_data)
        data = json.loads(output)
        if data['results']:
            cv2.imwrite('frame.jpg', frame)
            for candidate in data['results'][0]['candidates']:
                candidates.append(candidate)
                
def send_post_request(alpr_results):
    if len(alpr_results['plates']) > 0:
        with open('frame.jpg', 'rb') as img:
            image_data = img.read()
        encoded_image = base64.b64encode(image_data)
        image_str = encoded_image.decode('utf-8')
        alpr_results['image_data'] = image_str
        print("Sending post request...")
        response = requests.post(BACKEND_URL, json=alpr_results)
        if response.status_code == 200:
            print("Success")
        else:
            print("Failure")

def main():
    cap = cv2.VideoCapture(VIDEO_SOURCE)
    first_frame = None
    motion_detected_time = None
    frame_time = None
    contours = []
    candidates = []
    alpr_results = {'plates': [], 
                    'highest_confidence_plate' : '', 
                    'image_data' : '', 
                    'entering' : ENTERING}

    while True:
        # Capture a new frame from the camera feed
        ret, frame = cap.read()

        # If the capture was successful
        if ret:
            roi = frame[Y:Y+HEIGHT, X:X+WIDTH]
            # Calculate the difference between the current frame and the previous frame
            if first_frame is not None:
                contours = frame_diff(first_frame, roi)

                # If motion is detected
                if len(contours) > 0:
                    process_frame(roi, frame, candidates)
                    if not motion_detected_time:
                        motion_detected_time = frame_time

            # Update the previous frame
            first_frame = roi.copy()

            # Display the current frame
            cv2.imshow("Camera Feed", roi)

            # Check if enough time has elapsed since motion was detected
            if motion_detected_time and (frame_time - motion_detected_time) >= 2200:
                # Send a POST request with the license plates
                highest_confidence = 0
                highest_confidence_plate = None
                for candidate in candidates:
                    alpr_results['plates'].append(candidate['plate'])
                    if candidate['confidence'] > highest_confidence:   
                        highest_confidence_plate = candidate['plate']
                        highest_confidence = candidate['confidence']
                alpr_results['highest_confidence_plate'] = highest_confidence_plate
                send_post_request(alpr_results) 
                alpr_results = {'plates': [], 
                                'highest_confidence_plate' : '', 
                                'image_data' : '', 
                                'entering' : ENTERING}
                candidates = []
                motion_detected_time = None

            # Get the current frame time
            frame_time = cap.get(cv2.CAP_PROP_POS_MSEC)

            # Exit the program if the 'q' key is pressed
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        else:
            print("Error capturing frame.")
            break

    # Release the capture object and close all windows
    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()