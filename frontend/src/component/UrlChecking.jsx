import { useState } from "react"
import Button from "react-bootstrap/esm/Button";
import axios from "axios";

const API_URL = "http://localhost:5050/api/url";

export default function Urlchecking() {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null)
    const [showResult, setShowResult] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url){
            alert("Please enter your URL...");
            return;
        }
        setShowResult(true);
        setError(null);
        try {
            const res = await axios.post(`${API_URL}`, {url});
            setResult(res.data);
            setUrl('');            
        } catch (err) {
            setError(ErrorEvent.res?.data?.message);
            console.log("api url webrisk error", err);
        } 
    };
    const newScan = (e) => {
        e.preventDefault();
        setResult(null);
        setError(null);
    };

    return (
        <>
            <div className="m-4 text-align-center justify-content-center">
                <h1>Welcome to romdoul</h1>
                <p>Checking if your url is safe to explore</p>
            </div>
            <div id="urlBox" >
                {!result ? (
                <form onSubmit={handleSubmit}>
                    <input className="url_box"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter URL to check" required />
                    <Button className="btn1" type="submit"
                            disabled={showResult}> {showResult ? 'Checking' : 'Check URL'}</Button>
                </form>) : 
                (<div className={`result: ${result.isSafe ? 'safe' : 'malicious'}`} >
                    <div className="scan_box">
                            <h3>Scan Results</h3>
                            <div className="result">
                            <strong>URL: </strong>
                            <span>{result.analysis.domain.name}</span>
                            </div>
                            <div className="result">
                            <strong>Status: </strong>
                                <span
                                    style={{ backgroundColor: result.isSafe ? 'rgb(146, 223, 146)' : 'rgb(252, 81, 81)', borderRadius: '0.5rem', padding:'0.5rem'}}>
                                    
                                {result.isSafe ? 'SAFE' : 'MALICIOUS'}
                                </span>
                            </div>
                            
                            {!result.isSafe && (
                                <div className="result">
                                <p><strong>Threat: </strong> {result.analysis.threatDetail.map((threat, index) => (
                                    <li key={index}>
                                        <strong>{ threat.type}:  </strong> {threat.description}
                                    </li>
                                ))}</p>
                                </div>
                            )}

                        <Button onClick={newScan}>Scan Another URL</Button>
                    </div>
                </div>)
                }
                {error && (
                    <div>{error}
                    <Button variant="link" onClick={newScan}>Try Again</Button>
                    </div>
                )}
            </div>
            <article className="info-box m-4">
                <summary className="info-summary">
                    Did you know what a URL is made of?
                </summary>
                <details className="info-details">
                    <p>A URL (Uniform Resource Locator) consists of several parts:</p>
                    <ul>
                        <li><strong>Protocol:</strong> http:// or https://</li>
                        <li><strong>Domain:</strong> The website address (e.g., example.com)</li>
                        <li><strong>Path:</strong> Specific page or resource location</li>
                        <li><strong>Parameters:</strong> Additional data after ?</li>
                    </ul>
                </details>
                <p className="info-footer">Check before you click - Stay vigilant. Happy surfing!</p>
            </article>
        
    </>
    );
}
