'use client';
import { useState } from 'react';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegendContent } from '@/components/ui/chart';
import { Switch } from '@/components/ui/switch';
import { useParams } from 'next/navigation';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from 'recharts';

const workoutStats = [
  {
    week: 'Week 1',
    dateRange: 'Jan 1 - Jan 7',
    ao: 'AO Alpha',
    workoutType: 'Bootcamp',
    attendance: 24,
    newPax: 2,
    weather: 'Sunny',
  },
  {
    week: 'Week 1',
    dateRange: 'Jan 1 - Jan 7',
    ao: 'AO Bravo',
    workoutType: 'Ruck',
    attendance: 18,
    newPax: 1,
    weather: 'Cloudy',
  },
  {
    week: 'Week 2',
    dateRange: 'Jan 8 - Jan 14',
    ao: 'AO Alpha',
    workoutType: 'Bootcamp',
    attendance: 27,
    newPax: 0,
    weather: 'Rainy',
  },
  {
    week: 'Week 2',
    dateRange: 'Jan 8 - Jan 14',
    ao: 'AO Delta',
    workoutType: 'Run Club',
    attendance: 12,
    newPax: 0,
    weather: 'Cold',
  },
  {
    week: 'Week 3',
    dateRange: 'Jan 15 - Jan 21',
    ao: 'AO Echo',
    workoutType: 'Bootcamp',
    attendance: 30,
    newPax: 3,
    weather: 'Sunny',
  },
  {
    week: 'Week 4',
    dateRange: 'Jan 22 - Jan 28',
    ao: 'AO Zulu',
    workoutType: 'HIIT',
    attendance: 16,
    newPax: 1,
    weather: 'Windy',
  },
  {
    week: 'Week 5',
    dateRange: 'Jan 29 - Feb 4',
    ao: 'AO Bravo',
    workoutType: 'Bootcamp',
    attendance: 20,
    newPax: 0,
    weather: 'Foggy',
  },
  {
    week: 'Week 6',
    dateRange: 'Feb 5 - Feb 11',
    ao: 'AO Alpha',
    workoutType: 'Ruck',
    attendance: 22,
    newPax: 2,
    weather: 'Rainy',
  },
  {
    week: 'Week 7',
    dateRange: 'Feb 12 - Feb 18',
    ao: 'AO Echo',
    workoutType: 'Bootcamp',
    attendance: 31,
    newPax: 2,
    weather: 'Sunny',
  },
];

export default function Dashboard() {
  const [selectedWeek, setSelectedWeek] = useState('Week 7');

  const weekOptions = [...new Set(workoutStats.map(stat => stat.week))];
  const currentStats = workoutStats.filter(stat => stat.week === selectedWeek);

  const weeklyData = [
    { label: 'Week 1', pax: 42 },
    { label: 'Week 2', pax: 56 },
    { label: 'Week 3', pax: 62 },
    { label: 'Week 4', pax: 50 },
    { label: 'Week 5', pax: 74 },
  ];

  const yearlyData = [
    { label: '2021', pax: 1250 },
    { label: '2022', pax: 1580 },
    { label: '2023', pax: 1925 },
    { label: '2024', pax: 2170 },
  ];

  const chartConfig = {
    pax: {
      label: 'PAX Turnout',
      color: '#00FFFF',
    },
  };

  const [showYoY, setShowYoY] = useState(false);
  const data = showYoY ? yearlyData : weeklyData;
  const params = useParams();
  const regionId = params.id;

  return (
    <div>
      <div className="bg-gray-950 border-b border-gray-800 px-6 py-4 text-white w-full flex justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/"
                className="inline-block px-4 py-2 text-sm hover:bg-gray-800 rounded-md transition-colors"
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-gray-800 p-4 rounded-md">
                Regions
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-gray-800 p-4 rounded-md">
                <ul className="grid gap-3 w-[200px]">
                  <li>
                    <NavigationMenuLink href="/region/raleigh" className="hover:underline text-sm">
                      Raleigh
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      href="/region/charlotte"
                      className="hover:underline text-sm"
                    >
                      Charlotte
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink href="/region/durham" className="hover:underline text-sm">
                      Durham
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="#weekly-stats"
                className="inline-block px-4 py-2 text-sm hover:bg-gray-800 rounded-md transition-colors"
              >
                Stats
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* About */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/about"
                className="inline-block px-4 py-2 text-sm hover:bg-gray-800 rounded-md transition-colors"
              >
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>

          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>

      <section
        className="relative w-full h-[50vh] bg-cover"
        style={{
          backgroundImage: 'url("/workout-img.jpg")',
          backgroundPosition: 'center 0%',
        }}
      >
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            F3 - {regionId ? regionId : 'Region'}
          </h1>
          <p className="text-xl text-gray-200 mt-4 max-w-2xl">"Discipline equals freedom."</p>
        </div>

        <div className="absolute bottom-6 w-full flex justify-center">
          <div className="animate-bounce text-white text-3xl">↓</div>
        </div>
      </section>

      <section className="bg-gray-950 py-16 text-white w-full flex flex-col items-center justify-center">
        <div className="w-full text-center pt-5 pr-5">
          <h2 className="text-2xl font-bold mb-4">PAX Turnout Over Time</h2>
          <div className="flex items-center justify-end gap-3 mb-6">
            <span className="text-sm text-gray-300">Weekly</span>
            <Switch checked={showYoY} onCheckedChange={setShowYoY} />
            <span className="text-sm text-gray-300">Yearly</span>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-6 justify-center">
            <ChartContainer
              config={chartConfig}
              className="w-[50%] bg-gray-900 rounded-xl pt-4 pr-4"
            >
              <LineChart data={data}>
                <XAxis dataKey="label" stroke="#94a3b8"></XAxis>
                <YAxis stroke="#94a3b8">
                  <Label
                    value="PAX Count"
                    angle={-90}
                    position="insideLeft"
                    fill="#94a3b8"
                    style={{ textAnchor: 'middle' }}
                  />
                </YAxis>
                <ChartLegendContent />
                <Line
                  type="monotone"
                  dataKey="pax"
                  stroke="var(--color-pax)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
      </section>

      <section id="weekly-stats" className="py-14 bg-gray-950 text-white">
        <div className="w-[85%] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Weekly Workout Stats</h2>
            <select
              value={selectedWeek}
              onChange={e => setSelectedWeek(e.target.value)}
              className="px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-md"
            >
              {weekOptions.map(week => (
                <option key={week} value={week}>
                  {week}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentStats.map((stat, index) => (
              <Card
                key={index}
                className="bg-gray-800 text-white border border-gray-700 shadow-md pt-4"
              >
                <CardContent className="space-y-2">
                  <CardTitle className="text-lime-400">{stat.ao}</CardTitle>
                  <p className="text-sm text-gray-300">
                    Workout Type: <span className="text-white">{stat.workoutType}</span>
                  </p>
                  <p className="text-sm text-gray-300">
                    Attendance: <span className="text-white">{stat.attendance}</span>
                  </p>
                  <p className="text-sm text-gray-300">
                    New PAX: <span className="text-white">{stat.newPax}</span>
                  </p>
                  <p className="text-sm text-gray-300">
                    Weather: <span className="text-white">{stat.weather}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
