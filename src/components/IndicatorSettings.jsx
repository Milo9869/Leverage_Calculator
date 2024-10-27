import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIndicators } from '../context/IndicatorsContext';

const IndicatorSettings = () => {
  const {
    settings,
    updateRsiSettings,
    updateMacdSettings,
    updateBollingerSettings,
    updateFibonacciSettings
  } = useIndicators();

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Configuration des Indicateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rsi" className="w-full">
          <TabsList>
            <TabsTrigger value="rsi">RSI</TabsTrigger>
            <TabsTrigger value="macd">MACD</TabsTrigger>
            <TabsTrigger value="bollinger">Bollinger</TabsTrigger>
            <TabsTrigger value="fibonacci">Fibonacci</TabsTrigger>
          </TabsList>

          <TabsContent value="rsi">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Période RSI</label>
                <Slider
                  value={[settings.rsi.period]}
                  onValueChange={(value) => 
                    updateRsiSettings({ period: value[0] })
                  }
                  min={2}
                  max={50}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-sm">2</span>
                  <span className="text-sm font-medium">{settings.rsi.period}</span>
                  <span className="text-sm">50</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Niveau de survente</label>
                <Slider
                  value={[settings.rsi.oversold]}
                  onValueChange={(value) => 
                    updateRsiSettings({ oversold: value[0] })
                  }
                  min={20}
                  max={40}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Niveau de surachat</label>
                <Slider
                  value={[settings.rsi.overbought]}
                  onValueChange={(value) => 
                    updateRsiSettings({ overbought: value[0] })
                  }
                  min={60}
                  max={80}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Alertes automatiques</label>
                <Switch
                  checked={settings.rsi.alerts}
                  onCheckedChange={(checked) =>
                    updateRsiSettings({ alerts: checked })
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="macd">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">EMA Rapide</label>
                <Slider
                  value={[settings.macd.fastPeriod]}
                  onValueChange={(value) =>
                    updateMacdSettings({ fastPeriod: value[0] })
                  }
                  min={5}
                  max={30}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">EMA Lente</label>
                <Slider
                  value={[settings.macd.slowPeriod]}
                  onValueChange={(value) =>
                    updateMacdSettings({ slowPeriod: value[0] })
                  }
                  min={10}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Signal</label>
                <Slider
                  value={[settings.macd.signalPeriod]}
                  onValueChange={(value) =>
                    updateMacdSettings({ signalPeriod: value[0] })
                  }
                  min={5}
                  max={20}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bollinger">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Période</label>
                <Slider
                  value={[settings.bollinger.period]}
                  onValueChange={(value) =>
                    updateBollingerSettings({ period: value[0] })
                  }
                  min={5}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Écarts-types</label>
                <Slider
                  value={[settings.bollinger.deviations]}
                  onValueChange={(value) =>
                    updateBollingerSettings({ deviations: value[0] })
                  }
                  min={1}
                  max={4}
                  step={0.5}
                  className="mt-2"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fibonacci">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Fenêtre de détection</label>
                <Slider
                  value={[settings.fibonacci.windowSize]}
                  onValueChange={(value) =>
                    updateFibonacciSettings({ windowSize: value[0] })
                  }
                  min={5}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto-détection des pivots</label>
                <Switch
                  checked={settings.fibonacci.autoDetect}
                  onCheckedChange={(checked) =>
                    updateFibonacciSettings({ autoDetect: checked })
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IndicatorSettings;