
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff } from 'lucide-react';

interface WebcamMonitorProps {
  isActive: boolean;
  onPermissionGranted: (granted: boolean) => void;
}

const WebcamMonitor: React.FC<WebcamMonitorProps> = ({ isActive, onPermissionGranted }) => {
  const webcamRef = useRef<Webcam>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isActive) {
      requestWebcamPermission();
    }
  }, [isActive]);

  const requestWebcamPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      setError('');
      onPermissionGranted(true);
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      setHasPermission(false);
      setError('Webcam access denied. Please allow camera permissions to continue.');
      onPermissionGranted(false);
      console.error('Webcam permission error:', err);
    }
  };

  if (!isActive) return null;

  if (hasPermission === false) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border-2 border-red-300 rounded-lg p-4 max-w-sm z-50">
        <div className="flex items-center gap-2 mb-2">
          <CameraOff className="text-red-600" size={20} />
          <span className="font-semibold text-red-800">Camera Required</span>
        </div>
        <p className="text-sm text-red-700 mb-3">{error}</p>
        <button
          onClick={requestWebcamPermission}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        >
          Enable Camera
        </button>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 border-2 border-blue-300 rounded-lg p-4 z-50">
        <div className="flex items-center gap-2">
          <Camera className="text-blue-600 animate-pulse" size={20} />
          <span className="font-semibold text-blue-800">Requesting camera access...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-64 h-48 bg-black rounded-lg overflow-hidden border-4 border-white shadow-2xl z-50">
      <div className="relative w-full h-full">
        <Webcam
          ref={webcamRef}
          audio={false}
          width={256}
          height={192}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 256,
            height: 192,
            facingMode: "user"
          }}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          RECORDING
        </div>
      </div>
    </div>
  );
};

export default WebcamMonitor;
