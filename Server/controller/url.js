import axios from 'axios'
import dotenv from "dotenv";
import UrlCheck from '../schema/url_model.js';
dotenv.config();
const API_KEY = process.env.GOOGLE_API
const API_KEY_VIP = process.env.VIRUSTOTAL_API
const trustedDomain = ["google.com", "microsoft.com", "apple.com", "nav.gov.hu", "*.gov.hu"]

async function checkGoogle(url) {
    try {
        const url_webrisk = `https://webrisk.googleapis.com/v1/uris:search?key=${API_KEY}&uri=${encodeURIComponent(url)}&threatTypes=MALWARE&threatTypes=UNWANTED_SOFTWARE&threatTypes=SOCIAL_ENGINEERING`;
        const googleResponse = await axios.get(url_webrisk);
        const isThreat = googleResponse.data.threat?.threatTypes?.length > 0;
    return {
        isThreat,
        threatTypes: isThreat ? googleResponse.data.threat.threatTypes : [],
        data: googleResponse.data,
        }
    } catch (error) {
        console.error("Google webrisk error", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        })    
    }
}

async function checkVirusTotal(url) {
    try {
        const encodedParams = new URLSearchParams();
        encodedParams.set('url', url);
        const virusResponse = await axios.post(
            'https://www.virustotal.com/api/v3/urls', encodedParams, {
                headers: {
                    accept: 'application/json',
                    'x-apikey': API_KEY_VIP,
                    'content-type': 'application/x-www-form-urlencoded'
                },
                timeout: 15000
            }
        );
        const scanId = virusResponse.data.data.id;
        const startTime = Date.now();
        let result;
        while (Date.now() - startTime < 60000){
           await new Promise(resolve => setTimeout(resolve, 5000));
            result = await axios.get(`https://www.virustotal.com/api/v3/analyses/${scanId}`, {
                headers:
                {
                    accept: 'application/json',
                    'x-apikey': API_KEY_VIP
                }
            });
            if (result.data.data.attributes.status === 'completed')
                break;
        }
       
        const summaries = result.data.data.attributes.results;
        const threatTypes = new Set();
        const scannerResult = []
        for (const name in summaries){
            const scanner = summaries[name];
            const isPhishing = scanner.category === 'malicious' || scanner.result === 'phishing' ||
                (scanner.result && /phish|fraud|scam|malicious/i.test(scanner.result.toLowerCase()))
            if (isPhishing) {
                threatTypes.add("SOCIAL_ENGINEERING");
                scannerResult.push({
                    method: scanner.method,
                    engine_name: scanner.engine_name,
                    category: scanner.category,
                    result: scanner.result                   
                })
            }; 
            if (scanner.result === 'malware')
                threatTypes.add('MALWARE');
          
        }
        return {
            isThreat: threatTypes.size > 0,
            threatTypes: Array.from(threatTypes),
            data: scannerResult.length ? scannerResult : 'No threat found'
        }
    } catch (error) {
        console.error("Virus total error", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
    }
}

export const checkingUrl = async (request, response) => {
    const { url } = request.body;
    if (!url)
        return response.status(400).json({ error: 'Url is required' });
    try {
        if (!url.startsWith('http')) {
            return response.status(400).json({error: 'It should start with http:// or https://'});
        }
        const startDomain = new URL(url).hostname.replace('www.', '');
        const isSecure = url.startsWith('https://');
        const isTrusted = trustedDomain.some(d => startDomain.toLowerCase() === d.toLowerCase() || startDomain.toLowerCase().endsWith(`.${d.toLowerCase()}`));
        
        const [googleResponse, virusResponse] = await Promise.all([
            checkGoogle(url),
            checkVirusTotal(url),
        ]);
        const allType = [
            ...(googleResponse.threatTypes || []),
            ...(virusResponse.threatTypes || []),
        ];
        const nonDuplicate = [...new Set(allType)];
        const isThreat = nonDuplicate.length > 0;   
   
        const data = {
            url: url,
            status: isThreat ? 'malicious' : 'safe',
            details: {
                description: isThreat ? 'Potential threat detected' : 'No threat detected',
                analysis: {
                    protocol: isSecure ? 'HTTPS' : 'HTTP',
                    trusted: isTrusted,
                    domain: {
                        name: startDomain,
                        message: isTrusted ? 'Verified domain' : 'Unrecognized domain- exercise with caution'
                    },
                },
                source: {
                    google: {
                        threatTypes: googleResponse.data?.threat?.threatTypes || [],
                    },
                    virusTotal: Array.isArray(virusResponse?.data) ? virusResponse.data.map(item => ({
                        engine_name: item.engine_name,
                        category: item.category,
                        result: item.result
                    })) : []
                },
            }};
        let histories = await UrlCheck.findOneAndUpdate(
            { url },
            data,
            {new: true, upsert: true}
        );

        response.json({
            isSafe: !isThreat,
            history: histories._id,
            analysis: {
                protocol: {
                    type: isSecure ? 'HTTPS' : 'HTTP',
                    secure: isSecure,
                    message: isSecure ? 'data is in secure connection' : 'data could be intercepted'
                },
                domain: {
                    name: startDomain,
                    official: isTrusted,
                    message: isTrusted ? 'Verified domain' : 'Unrecognized domain- exercise with caution'
                },
                threatDetail: nonDuplicate.map(type => ({
                    type: type,
                    description: getDescription(type)
                })),
                summary: {
                    google: googleResponse.data?.threat || null,
                    virusTotal: virusResponse.data || null                
                }
            }
        });
    } catch (error) {
        console.error("Full error", error);
        response.status(500).json({ success: false, message: "Error in analysis" });
    }
};

function getDescription(threatTypes) {
    const description = {
        MALWARE: "This may contain malicious software which potentially harm or exploit your devices.",
        SOCIAL_ENGINEERING: "This may attempt to manipulating user to steal personal data or control computer system.",
        UNWANTED_SOFTWARE: "This may negatively impact on user experience"
    };
    return description[threatTypes] || "Potential security risk";
}
