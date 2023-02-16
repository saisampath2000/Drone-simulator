import { useState } from 'react';
import './App.css';
import MapBox from './Components/MapBox';

function App() {
  const [data, setData] = useState(null);
  const [renderMap, setRenderMap] = useState(false);

  const handleTextBox = (e) => {
    setData(JSON.parse(e.target.value));
  };

  const handleFileUpload = (e) => {
    let file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        setData(JSON.parse(reader.result))
      };
    }
  };

  return (
    <>
      {renderMap ? <MapBox data={data} setRenderMap={setRenderMap} /> :
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', padding: '250px' }}>
          <input onChange={(e) => handleTextBox(e)} type='text' placeholder='Enter JSON String ....' style={{ marginBottom: '25px' }} />
          <label class="custom-file-upload" style={{ marginBottom: '25px', borderRadius: '5px' }}>
            <input onChange={(e) => handleFileUpload(e)} type="file" />
            upload json file
          </label>
          {data && <p style={{ color: '#00FF00', fontSize: '14px' }}>Successfully uploaded file or entered json string</p>}
          <button onClick={() => setRenderMap(true)} style={{ padding: '0.5rem 1rem', boxShadow: '0px 0px 0.6em #111c;', color: '#fff', cursor: 'pointer', backgroundColor: '#25f', borderRadius: '5px' }}>simulate</button>
        </div>
      }
    </>
  );
}

export default App;
