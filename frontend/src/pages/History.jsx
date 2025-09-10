import { useEffect, useState,  } from "react";
import axios from 'axios';

const API_URL = "http://localhost:5050/api/histories";

export default function History() {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    axios.get(API_URL) 
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          const load = res.data.data.map(item => ({
            url: item.url,
            status: item.status,
            checked_at: item.checked_at,
            name: item.full.analysis.domain.name,
            google: item.full.source.google.threatTypes.join(", "),
            virusTotal: item.full.source.virusTotal.map(v => ` "${v.engine_name} ": ${v.result}`).join(" , "),          
          }));
          setHistory(load);
        } else {
          throw new Error("Invaid data format");
        }
      })
      .catch(err => console.log(err));
  })
  

  return (
    <>
      <table className="table-container">
        <thead>
          <tr>
            <th>URL</th>
            <th>STATUS</th>
            <th>DOMAIN</th>
            <th>CHECKED AT</th>           
            <th>GOOGLE RESULT</th>
            <th>VIRUSTOTAL RESULT</th>
          </tr>
        </thead>
        <tbody>
          {
            history.map((item, index) => (
              <tr key={index}>
                <td className="url-td">{item.url}</td>
                <td className="stat-td">{item.status}</td>
                <td className="name-td">{item.name}</td>
                <td className="date-td">{new Date(item.checked_at).toLocaleString()}</td>
                <td className="go-td">{item.google}</td>
                <td className="vt-td">{item.virusTotal}
                </td>
              </tr>
            ))
          }        
        </tbody>
      </table>
    </>
  )
}
