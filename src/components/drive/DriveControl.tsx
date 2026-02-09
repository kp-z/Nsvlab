import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Gauge, 
  Navigation, 
  Zap, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  Target,
  Wind,
  Car,
  Hand,
  PlayCircle,
  PauseCircle,
  SkipForward,
  Radio,
  Eye,
  MapPin,
  Users,
  Layers
} from 'lucide-react';
import { ModelConfig } from '../DrivePanel';
import { useTheme } from '../../contexts/ThemeContext';

interface DriveControlProps {
  isActive: boolean;
  config: ModelConfig;
}

interface VehicleState {
  speed: number;
  acceleration: number;
  steering: number;
  throttle: number;
  brake: number;
  heading: number;
  position: { x: number; y: number };
}

interface SceneObject {
  id: string;
  type: 'vehicle' | 'pedestrian' | 'obstacle';
  distance: number;
  angle: number;
  velocity: number;
}

export function DriveControl({ isActive, config }: DriveControlProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [vehicleState, setVehicleState] = useState<VehicleState>({
    speed: 0,
    acceleration: 0,
    steering: 0,
    throttle: 0,
    brake: 0,
    heading: 0,
    position: { x: 0, y: 0 }
  });

  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);
  const [controlMode, setControlMode] = useState<'autonomous' | 'manual'>('autonomous');
  const [isPaused, setIsPaused] = useState(false);

  const [logs, setLogs] = useState<{ time: string; message: string; level: 'info' | 'warning' | 'error' }[]>([
    { time: '00:00:00', message: 'Drive system initialized', level: 'info' }
  ]);

  // Simulate vehicle state updates when active
  useEffect(() => {
    if (isActive && !isPaused) {
      const interval = setInterval(() => {
        setVehicleState(prev => ({
          speed: Math.min(80, Math.max(0, prev.speed + (Math.random() - 0.3) * 5)),
          acceleration: (Math.random() - 0.5) * 3,
          steering: (Math.random() - 0.5) * 25,
          throttle: Math.random() * 100,
          brake: Math.random() * 30,
          heading: (prev.heading + (Math.random() - 0.5) * 3 + 360) % 360,
          position: {
            x: prev.position.x + Math.random() * 2,
            y: prev.position.y + Math.random() * 2
          }
        }));

        // Simulate scene objects
        if (Math.random() > 0.8) {
          setSceneObjects([
            {
              id: 'v1',
              type: 'vehicle',
              distance: 15 + Math.random() * 30,
              angle: (Math.random() - 0.5) * 40,
              velocity: 40 + Math.random() * 30
            },
            {
              id: 'p1',
              type: 'pedestrian',
              distance: 25 + Math.random() * 20,
              angle: (Math.random() - 0.5) * 60,
              velocity: 2 + Math.random() * 3
            }
          ]);
        }

        // Add random logs
        if (Math.random() > 0.85) {
          const messages = [
            { message: 'Lane keeping active', level: 'info' as const },
            { message: 'Vehicle detected in adjacent lane', level: 'warning' as const },
            { message: 'Adjusting speed for traffic', level: 'info' as const },
            { message: 'Approaching intersection', level: 'info' as const },
            { message: 'Planning lane change', level: 'info' as const }
          ];
          const msg = messages[Math.floor(Math.random() * messages.length)];
          const now = new Date();
          setLogs(prev => [
            { time: now.toTimeString().split(' ')[0], ...msg },
            ...prev.slice(0, 9)
          ]);
        }
      }, 500);

      return () => clearInterval(interval);
    } else if (!isActive) {
      // Reset state when stopped
      setVehicleState({
        speed: 0,
        acceleration: 0,
        steering: 0,
        throttle: 0,
        brake: 0,
        heading: 0,
        position: { x: 0, y: 0 }
      });
      setSceneObjects([]);
    }
  }, [isActive, isPaused]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Main Driving View */}
      <div className="flex-1 flex gap-3 p-3 overflow-hidden">
        {/* Left Panel - Scene View & Control */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Scene Visualization */}
          <Card className={`${isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-gray-900 border-gray-700'} flex-1 relative overflow-hidden`}>
            {/* Simulated driving view */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Road simulation */}
              <div className="relative w-full h-full overflow-hidden">
                {/* Sky/Background */}
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-gray-800 to-gray-700' : 'bg-gradient-to-b from-blue-200 to-gray-300'}`}></div>
                
                {/* Road */}
                <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-gray-600 to-gray-500 overflow-hidden">
                  {/* Lane markings */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2">
                    <div className="h-full flex flex-col justify-around">
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1 h-8 bg-white opacity-80"
                          style={{ 
                            animation: 'moveDown 1s linear infinite',
                            animationDelay: `${i * 0.125}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Road edges */}
                  <div className="absolute left-[20%] top-0 bottom-0 w-2 bg-yellow-400 opacity-60"></div>
                  <div className="absolute right-[20%] top-0 bottom-0 w-2 bg-yellow-400 opacity-60"></div>
                </div>

                {/* Detected Objects Overlay */}
                {sceneObjects.map((obj) => (
                  <div
                    key={obj.id}
                    className="absolute"
                    style={{
                      left: `${50 + obj.angle}%`,
                      bottom: `${Math.max(30, 100 - obj.distance * 1.5)}%`,
                      transform: 'translate(-50%, 0)'
                    }}
                  >
                    <div className={`p-2 rounded border-2 backdrop-blur-sm ${
                      obj.type === 'vehicle' 
                        ? 'border-blue-400 bg-blue-500/20'
                        : obj.type === 'pedestrian'
                        ? 'border-yellow-400 bg-yellow-500/20'
                        : 'border-red-400 bg-red-500/20'
                    }`}>
                      {obj.type === 'vehicle' ? (
                        <Car className="w-6 h-6 text-blue-300" />
                      ) : (
                        <Users className="w-6 h-6 text-yellow-300" />
                      )}
                    </div>
                    <div className="mt-1 text-[9px] text-white bg-black/70 px-1.5 py-0.5 rounded text-center">
                      {obj.distance.toFixed(0)}m
                    </div>
                  </div>
                ))}

                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Top status bar */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`${isActive ? 'bg-green-600' : 'bg-blue-600'} text-white text-xs`}>
                        {controlMode === 'autonomous' ? '🤖 Autonomous' : '🎮 Manual'}
                      </Badge>
                      {isPaused && (
                        <Badge className="bg-yellow-600 text-white text-xs">
                          ⏸ Paused
                        </Badge>
                      )}
                    </div>
                    <div className="text-white text-xs font-mono bg-black/50 px-3 py-1 rounded backdrop-blur-sm">
                      {config.dataSource.toUpperCase()} → {config.pipelineStage.toUpperCase()}
                    </div>
                  </div>

                  {/* Speed display */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="text-white text-4xl font-bold font-mono">
                        {vehicleState.speed.toFixed(0)}
                      </div>
                      <div className="text-gray-300 text-xs">km/h</div>
                    </div>
                  </div>

                  {/* Steering indicator */}
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-white/20 w-32">
                      <div className="text-gray-300 text-xs mb-2 text-center">Steering</div>
                      <div className="relative h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50"></div>
                        <div 
                          className="absolute top-0 bottom-0 w-1 bg-purple-500 rounded-full transition-all duration-200"
                          style={{
                            left: `${50 + vehicleState.steering / 30 * 50}%`,
                            transform: 'translateX(-50%)'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Compass */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-black/70 backdrop-blur-sm rounded-full p-2 border border-white/20">
                      <div className="relative w-12 h-12">
                        <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                          {vehicleState.heading >= 0 && vehicleState.heading < 45 ? 'N' :
                           vehicleState.heading >= 45 && vehicleState.heading < 135 ? 'E' :
                           vehicleState.heading >= 135 && vehicleState.heading < 225 ? 'S' :
                           vehicleState.heading >= 225 && vehicleState.heading < 315 ? 'W' : 'N'}
                        </div>
                        <div 
                          className="absolute inset-0 flex items-start justify-center"
                          style={{ transform: `rotate(${vehicleState.heading}deg)` }}
                        >
                          <div className="w-1 h-5 bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Control Panel */}
          <Card className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-300'} p-3 flex-shrink-0`}>
            <div className="flex items-center justify-between gap-4">
              {/* Control Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={controlMode === 'autonomous' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setControlMode('autonomous')}
                  className={`h-8 text-xs ${
                    controlMode === 'autonomous' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : isDark ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'
                  }`}
                >
                  <Activity className="w-3 h-3 mr-1" />
                  Autonomous
                </Button>
                <Button
                  variant={controlMode === 'manual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setControlMode('manual')}
                  className={`h-8 text-xs ${
                    controlMode === 'manual' 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : isDark ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'
                  }`}
                >
                  <Hand className="w-3 h-3 mr-1" />
                  Manual
                </Button>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPaused(!isPaused)}
                  disabled={!isActive}
                  className={`h-8 w-8 p-0 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
                >
                  {isPaused ? (
                    <PlayCircle className="w-4 h-4" />
                  ) : (
                    <PauseCircle className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!isActive}
                  className={`h-8 w-8 p-0 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Throttle & Brake Bars */}
              <div className="flex-1 flex items-center gap-3 max-w-md">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Throttle</span>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {vehicleState.throttle.toFixed(0)}%
                    </span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full bg-green-500 transition-all duration-200"
                      style={{ width: `${vehicleState.throttle}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Brake</span>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {vehicleState.brake.toFixed(0)}%
                    </span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full bg-red-500 transition-all duration-200"
                      style={{ width: `${vehicleState.brake}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - Telemetry & Status */}
        <div className="w-80 flex flex-col gap-3 overflow-y-auto">
          {/* Vehicle Status */}
          <Card className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-300'} p-3`}>
            <div className="flex items-center gap-2 mb-3">
              <Gauge className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h4 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
                Vehicle Status
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className={`p-2 rounded ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'} mb-1`}>Speed</div>
                <div className={`text-lg font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {vehicleState.speed.toFixed(1)}
                </div>
                <div className={`text-[9px] ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>km/h</div>
              </div>

              <div className={`p-2 rounded ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'} mb-1`}>Accel</div>
                <div className={`text-lg font-bold ${
                  vehicleState.acceleration >= 0 
                    ? isDark ? 'text-green-400' : 'text-green-600' 
                    : isDark ? 'text-red-400' : 'text-red-600'
                }`}>
                  {vehicleState.acceleration > 0 ? '+' : ''}{vehicleState.acceleration.toFixed(1)}
                </div>
                <div className={`text-[9px] ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>m/s²</div>
              </div>

              <div className={`p-2 rounded ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'} mb-1`}>Position X</div>
                <div className={`text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {vehicleState.position.x.toFixed(1)}m
                </div>
              </div>

              <div className={`p-2 rounded ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'} mb-1`}>Position Y</div>
                <div className={`text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {vehicleState.position.y.toFixed(1)}m
                </div>
              </div>
            </div>
          </Card>

          {/* Scene Objects */}
          <Card className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-300'} p-3`}>
            <div className="flex items-center gap-2 mb-3">
              <Eye className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <h4 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
                Detected Objects
              </h4>
              <Badge variant="secondary" className="ml-auto text-[10px] h-5">
                {sceneObjects.length}
              </Badge>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {sceneObjects.length === 0 ? (
                <div className={`text-xs text-center py-3 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  No objects detected
                </div>
              ) : (
                sceneObjects.map((obj) => (
                  <div
                    key={obj.id}
                    className={`flex items-center justify-between p-2 rounded text-xs ${
                      isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {obj.type === 'vehicle' ? (
                        <Car className="w-3 h-3 text-blue-400" />
                      ) : (
                        <Users className="w-3 h-3 text-yellow-400" />
                      )}
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {obj.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                        {obj.distance.toFixed(0)}m
                      </span>
                      <span className={`text-[10px] font-mono ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                        {obj.velocity.toFixed(0)} km/h
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Model Info */}
          <Card className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-300'} p-3`}>
            <div className="flex items-center gap-2 mb-3">
              <Layers className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <h4 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
                Model Config
              </h4>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Type</span>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{config.modelType}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Mode</span>
                <Badge variant="secondary" className="h-5 text-[10px]">{config.inferenceMode}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Data</span>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${config.dataSource === 'base' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                  <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {config.dataSource.toUpperCase()} / {config.pipelineStage.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Precision</span>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{config.precision.toUpperCase()}</span>
              </div>
            </div>
          </Card>

          {/* System Events */}
          <Card className={`${isDark ? 'bg-[#252525] border-gray-700' : 'bg-white border-gray-300'} p-3 flex-1`}>
            <div className="flex items-center gap-2 mb-3">
              <Zap className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <h4 className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
                System Events
              </h4>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {logs.map((log, idx) => (
                <div 
                  key={idx}
                  className={`flex items-start gap-2 p-2 rounded text-xs ${
                    isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'
                  }`}
                >
                  {log.level === 'warning' ? (
                    <AlertTriangle className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                  ) : log.level === 'error' ? (
                    <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-3 h-3 flex-shrink-0 mt-0.5 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`font-mono text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'} mb-0.5`}>
                      {log.time}
                    </div>
                    <div className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {log.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes moveDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
}
