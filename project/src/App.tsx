import React, { useState } from 'react';
import { ChevronDown, Trophy, Target, Users, TrendingUp } from 'lucide-react';
import axios from 'axios';



const teams = [
  'Manchester United', 'Manchester City', 'Liverpool', 'Chelsea', 'Arsenal',
  'Tottenham', 'Newcastle', 'Brighton', 'Aston Villa', 'West Ham',
  'Crystal Palace', 'Fulham', 'Wolves', 'Everton', 'Brentford',
  'Nottingham Forest', 'Leeds United', 'Leicester City', 'Southampton', 'Bournemouth'
];
const formations = [
        '4-3-3', '4-2-3-1', '3-4-3', '3-5-2', '3-4-1-2', '4-2-2-2',
        '4-1-4-1', '4-4-1-1', '4-4-2',  '3-5-1-1',
       '4-5-1'
]

const venues = ['Home','Away'];
function App() {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [venue,setVenue] = useState('')
  const [formation,setFormation] = useState('')
  const [date,setDate] = useState('')
  const [time,setTime] = useState('')
  const resultMap = ["Away win","Home Win","Draw"]
  


  

  const handlePredict = async () => {
    try {
      const response = await axios.post("http://localhost:5000/predict",{
        team:homeTeam,
        opponent:awayTeam,
        venue,
        formation,
        date,
        time

      });
      
      
      const label = resultMap[response.data.result]
      console.log("result :",label);
      
      setPrediction(label)
      setShowResult(true)
      

      
    } catch (error) {
      console.log("Prediction API error");
      
    }
    finally{
      setIsLoading(false);
    }
  };

  const canPredict = homeTeam && awayTeam && homeTeam !== awayTeam;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-xl">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Soccer<span className="text-green-600">Predict</span>
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Predictions</a>
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Statistics</a>
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Predict Match Outcomes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get AI-powered predictions for football matches with detailed probability analysis
          </p>
        </div>

        {/* Prediction Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Home Team */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Home Team
              </label>
              <div className="relative">
                <select
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                >
                  <option value="">Select home team</option>
                  {teams.map((team) => (
                    <option key={team} value={team} disabled={team === awayTeam}>
                      {team}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Away Team */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Away Team
              </label>
              <div className="relative">
                <select
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                >
                  <option value="">Select away team</option>
                  {teams.map((team) => (
                    <option key={team} value={team} disabled={team === homeTeam}>
                      {team}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
  <div className="grid md:grid-cols-3 gap-8 mb-8">
  {/* Match Date */}
  <div className="space-y-3">
    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
      Match Date
    </label>
    <input
      type="date"
      onChange={(e)=>setDate(e.target.value)}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
    />
  </div>

  <div className="space-y-3">
    <label className="block mb-2 text-sm font-semibold text-gray-700">MATCH HOUR (0–23)</label>
<select
  name="time"
  value={time}
  onChange={(e)=>setTime(e.target.value)}
  required
  className="bg-gray-50 border font-medium border-gray-200 text-gray-900 px-4 py-4  rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
>
  <option value="">Select hour</option>
  {[...Array(24).keys()].map((hour) => (
    <option key={hour} value={hour}>
      {hour}:00
    </option>
  ))}
</select>
  </div>


  {/* Formation */}
  <div className="space-y-3">
    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
      Formation
    </label>
    <div className="relative">
      <select
        value={formation}
        onChange={(e) => setFormation(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
      >
        <option value="">Select formation</option>
        {formations.map((formation) => (
          <option key={formation} value={formation}>
            {formation}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  </div>

  {/* Venue */}
  
</div>
<div className="space-y-3">
    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
      Venue
    </label>
    <div className="relative">
      <select
        value={venue}
        onChange={(e) => setVenue(e.target.value)}
        className="w-full  bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
      >
        <option value="">Select venue</option>
        {venues.map((ven) => (
          <option key={ven} value={ven}>
            {ven}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  </div>

          {/* Predict Button */}
          <div className="text-center py-4">
            <button
              onClick={handlePredict}
              disabled={!canPredict || isLoading}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Analyzing Match...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5" />
                  <span>Predict Match</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Prediction Result */}
        {showResult && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 animate-fadeIn">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Match Prediction :{prediction}
              </h3>
              
            </div>

            </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-600 p-2 rounded-xl">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">
                  Soccer<span className="text-green-600">Predict</span>
                </span>
              </div>
              <p className="text-gray-600 max-w-md">
                Advanced AI-powered football match prediction platform providing accurate 
                insights for football enthusiasts and analysts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-green-600 transition-colors">Match Predictions</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Team Statistics</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Historical Data</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Live Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-green-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 SoccerPredict. Built with modern web technologies for accurate football predictions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;