import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Initialize Telegram WebApp API
const tg = window.Telegram.WebApp;

export default function App() {
    const [activeFeature, setActiveFeature] = useState(null);
    const [initData, setInitData] = useState('');
    const [responses, setResponses] = useState(null);

    useEffect(() => {
        tg.ready();
        tg.expand();
        setInitData(tg.initData);
    }, []);

    // 🚀 ADSGRAM GATEKEEPER
    const handleFeatureClick = (feature) => {
        // Pseudo-code for Adsgram integration
        if (window.Adsgram) {
            window.Adsgram.init({ blockId: 'int-25882' })
                .show()
                .then(() => {
                    // Ad finished successfully, unlock feature
                    setActiveFeature(feature);
                })
                .catch((err) => {
                    // Ad failed or closed early
                    tg.showAlert("You must watch the ad to unlock this feature.");
                });
        } else {
            // Fallback if Adsgram isn't loaded
            setActiveFeature(feature);
        }
    };

    // Example API Call for Dual-AI
    const runDualAI = async (prompt) => {
        try {
            const res = await axios.post('https://your-backend.com/api/chat', {
                prompt: prompt,
                models: ['gpt-4', 'gemini']
            }, {
                headers: { 'x-telegram-init-data': initData }
            });
            setResponses(res.data);
        } catch (error) {
            tg.showAlert("API Error or Rate Limited");
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1 style={{ textAlign: 'center' }}>AI Utility Hub</h1>
            
            {/* Feature Menu */}
            {!activeFeature && (
                <div style={{ display: 'grid', gap: '10px' }}>
                    <button onClick={() => handleFeatureClick('dual-ai')}>🤖 Dual-AI Chat</button>
                    <button onClick={() => handleFeatureClick('text-to-video')}>🎥 Text to Video</button>
                    <button onClick={() => handleFeatureClick('name-styler')}>✨ Name Styler</button>
                    <button onClick={() => handleFeatureClick('code-creator')}>💻 Code File Creator</button>
                    {/* Add remaining 4 buttons... */}
                </div>
            )}

            {/* Feature Views */}
            {activeFeature === 'dual-ai' && (
                <div>
                    <h2>Dual-AI Chat</h2>
                    <input type="text" id="prompt" placeholder="Ask something..." style={{width: '100%'}}/>
                    <button onClick={() => runDualAI(document.getElementById('prompt').value)}>
                        Generate
                    </button>
                    
                    {responses && (
                        <div style={{ display: 'flex', marginTop: '20px', gap: '10px' }}>
                            <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
                                <h3>GPT-4</h3>
                                <p>{responses.gpt}</p>
                            </div>
                            <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
                                <h3>Gemini</h3>
                                <p>{responses.gemini}</p>
                            </div>
                        </div>
                    )}
                    <br/>
                    <button onClick={() => setActiveFeature(null)}>Back to Menu</button>
                </div>
            )}
            
            {/* Implement other feature views here */}
        </div>
    );
}
