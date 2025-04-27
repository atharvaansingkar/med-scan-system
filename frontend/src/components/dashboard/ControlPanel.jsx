import { useDashboardStore } from "../../lib/store";
import { useToast } from "../../contexts/ToastContext";
import "../../styles/control-panel.css";
import { PlayIcon, PauseIcon, SquareIcon, CameraIcon } from "../icons/Icons";

export default function ControlPanel() {
  const {
    isScanning,
    isPaused,
    startScan,
    stopScan,
    pauseScan,
    resumeScan,
    fetchStats,
    loadScanResults,
    processFrameOnce,
  } = useDashboardStore();
  const { toast } = useToast();

  const handleStart = async () => {
    try {
      startScan();
      await loadScanResults();
      await fetchStats();
      toast({ title: "Camera started", description: "System is ready to capture medicines" });
    } catch (error) {
      toast({ variant: "destructive", title: "Start Failed", description: error.message });
    }
  };

  const handleStop = () => {
    stopScan();
    toast({ title: "Camera Stopped", description: "System scanning has been halted" });
  };

  const handleProcess = async () => {
    await processFrameOnce();
  };

  return (
    <div className="control-panel">
      <div className="control-actions">
        {!isScanning ? (
          <button className="control-button primary" onClick={handleStart}>
            <PlayIcon /> Start Camera
          </button>
        ) : (
          <>
            <button 
              className="control-button secondary" 
              onClick={handleProcess}
            >
              <CameraIcon /> Process Frame
            </button>
            <button className="control-button danger" onClick={handleStop}>
              <SquareIcon /> Stop Camera
            </button>
          </>
        )}
      </div>
    </div>
  );
}