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
        const isThreat = allType.length > 0;
        const nonDuplicate = [...new Set(allType)];
               
        const data = {
            url: url,
            status: isThreat ? 'malicious' : 'safe',
            threat_type: nonDuplicate,
            details: JSON.stringify({
                analysis: {
                    protocol: isSecure ? 'HTTPS' : 'HTTP',
                    trusted: isTrusted
                },
            })};
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
                threatDetail: allType.map(type => ({
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


// async function checkCriminal(url) {
//     try {
//         const criminalResponse = await axios.post('https://api.criminalip.io/v1/domain/scan',
//             { url: url, }, { headers: { 'api-key': API_KEY_CIP, 'Content-Type': 'application/json' } },
//         );
//         const scanId = criminalResponse.data.scan_id;
//         await new Promise(resolve => setTimeout(resolve, 25000));
//         const report = await axios.get(`https://api.criminalip.io/v2/domain/report/${scanId}/`,
//             { headers: { 'api-key': API_KEY_CIP } });
//         const threatTypes = new Set();
//         const summaries = report.data.data || {};
        
//         if ( summaries.summary?.url_phishing_prob >= 3 || summaries.summary?.abuse_record > 0)
//             threatTypes.add('SOCIAL_ENGINEERING');


//         return {
//             isThreat: threatTypes.size > 0,
//             threatTypes: Array.from(threatTypes),
//             data: summaries
            
//         }
//     } catch (error) {
//         console.error("criminal IP error", {
//             status: error.response?.status,
//             data: error.response?.data,
//             message: error.message
//         });
//     }
// }
//testing
const testUrls = [
    // 'https://testsafebrowsing.appspot.com/s/malware.html', // Known malware
    // 'https://google.com', // Safe
    'https://testsafebrowsing.appspot.com/s/phishing.html', // Phishing
];

async function testGoogle() {
    for (const url of testUrls) {
        console.log(`\nTesting: ${url}`);
        try {
            console.log(`\nTesting-vt`);
            const result = await checkVirusTotal(url);
            console.log('Status:', result.isThreat ? '⚠️ Threat' : '✅ Safe');
            console.log('Threat Types:', result.threatTypes);
            console.log('Data:', result.data || 'No threats found');
            // console.log(`\nTesting-gg`);
            // const result1 = await checkGoogle(url);
            // console.log('Status:', result1.isThreat ? '⚠️ Threat' : '✅ Safe');
            // console.log('Threat Types:', result1.threatTypes);
            // console.log('Data:', result1.data?.threat || 'No threats found');
            // // console.log(`\nTesting-us`);
            //  const result2 = await checkCriminal(url);
            // // console.log('Status:', result2.isThreat ? '⚠️ Threat' : '✅ Safe');
            //  console.log('Threat Types:', result2.threatTypes);
            //  console.log('Data:', result2.data || 'No threats found');
        } catch (error) {
            console.error('Test failed:', error.message);
        }
    }
}
//testGoogle();
