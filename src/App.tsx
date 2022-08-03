import { CSSProperties, useState } from 'react';
import './style.css';
import { DetectFaces } from './AwsRekognitionFunction/DetectFaces'

function App() {
  	const [picture, setPicture] = useState<string>('');
	const [ageData, setAgeData] = useState<number[]>([]);
	const [breadData, setBreadData] = useState<string[]>([]);
	const [emotionData, setEmotionData] = useState<string[]>([]);
	const [eyeglassesData, setEyeglassesData] = useState<string[]>([]);
	const [eyesOpenData, setEyesOpenData] = useState<string[]>([]);
	const [genderData, setGenderData] = useState<string[]>([]);
	const [mouthOpenData, setMouthOpenData] = useState<string[]>([]);
	const [mustacheData, setMustacheData] = useState<string[]>([]);
	const [qualityData, setQualityData] = useState<number[]>([]);
	const [smileData, setSmileData] = useState<string[]>([]);
	const [sunglassesData, setSunglassesData] = useState<string[]>([]);
	const [confidenceData, setConfidenceData] = useState<number>();
	const [boundingBox, setBoundingBox] = useState<number[]>([]);
	const [styleScan, setStyleScan] = useState<CSSProperties>();	

	const style:CSSProperties = {
		position:"absolute",
		width: ((boundingBox[1]) * 450)+"px",
		height: ((boundingBox[0]) * 400)+"px",
		border:"4px dashed green",
		top:((boundingBox[2]) * 450)+"px",
		left:((boundingBox[3]) * 400)+"px"
	}

	const scanAnimation:CSSProperties = {
		animation: "scanning 5s forwards",
	}

  return (
    <div className='app'>
		<div className="part">
			<div className="imageSection">
				<img className="imageUploaded" src={picture} alt="Empty" />
				<div className="square" style={style}></div>
				<div className="laser" style={styleScan}></div>
			</div><br/>
			<label htmlFor="fileToUpload"><img className='iconUpload' src="icondrop.png" alt='Empty'/></label>
			<input hidden type="file" name="fileToUpload" placeholder="Upload file" id="fileToUpload" onChange={
				(e) => {
					if(e.target.files?.length != null){
						setPicture(URL.createObjectURL(e.target.files[0]));
					}
				var file:File;
				setStyleScan(scanAnimation)				
				file = (e.target.files as FileList)[0];
				var reader = new FileReader();
				reader.onload = (function (theFile) {
					return async function (e) {
						var img = document.createElement("img");
						var image = null;
						img.src = (e.target?.result as string);
						var jpg = true;
						try {
							image = window.atob((img.src).split("data:image/jpeg;base64,")[1]);
						} catch (e) {
							jpg = false;
						}
						if (jpg === false) {
							try {
								image = window.atob((img.src).split("data:image/png;base64,")[1])
							} catch (e) {
								alert("Not an image file Rekognition can process");
								return;
							}
						}
						const length = (image?.length as number);
						const imageBytes = new ArrayBuffer(length);
						const ua = new Uint8Array(imageBytes);
						for (var i = 0; i < length; i++) {
							ua[i] = (image?.charCodeAt(i) as number);
						}
						const fData = await DetectFaces(ua);
						if(fData?.FaceDetails !== undefined ){
							setAgeData([(fData.FaceDetails[0].AgeRange?.High as number),(fData.FaceDetails[0].AgeRange?.Low as number)]);
							setBreadData([(`${fData.FaceDetails[0].Beard?.Value}`),(`${fData.FaceDetails[0].Beard?.Confidence}`)]);
							if(fData.FaceDetails[0].Emotions){
								setEmotionData([(`${fData.FaceDetails[0].Emotions[0].Type}`),(`${fData.FaceDetails[0].Emotions[0].Confidence}`)]);
							}
							setEyeglassesData([(`${fData.FaceDetails[0].Eyeglasses?.Value}`),(`${fData.FaceDetails[0].Eyeglasses?.Confidence}`)]);
							setEyesOpenData([(`${fData.FaceDetails[0].EyesOpen?.Value}`),(`${fData.FaceDetails[0].EyesOpen?.Confidence}`)]);
							setGenderData([(`${fData.FaceDetails[0].Gender?.Value}`),(`${fData.FaceDetails[0].Gender?.Confidence}`)]);
							setMouthOpenData([(`${fData.FaceDetails[0].MouthOpen?.Value}`),(`${fData.FaceDetails[0].MouthOpen?.Confidence}`)]);
							setMustacheData([(`${fData.FaceDetails[0].Mustache?.Value}`),(`${fData.FaceDetails[0].Mustache?.Confidence}`)]);
							setQualityData([((fData.FaceDetails[0].Quality?.Brightness) as number),((fData.FaceDetails[0].Quality?.Sharpness) as number)]);
							setSmileData([(`${fData.FaceDetails[0].Smile?.Value}`),(`${fData.FaceDetails[0].Smile?.Confidence}`)]);
							setSunglassesData([(`${fData.FaceDetails[0].Sunglasses?.Value}`),(`${fData.FaceDetails[0].Sunglasses?.Confidence}`)]);
							setConfidenceData(fData.FaceDetails[0].Confidence);
							setBoundingBox([((fData.FaceDetails[0].BoundingBox?.Height) as number),((fData.FaceDetails[0].BoundingBox?.Width) as number),((fData.FaceDetails[0].BoundingBox?.Top) as number),((fData.FaceDetails[0].BoundingBox?.Left) as number)])
						}
					};
				})(file);
				reader.readAsDataURL(file);
				}
			} />
		</div>
	<div className="infoborder">
		<div className="information">
		  <div>
			<div className="value">
				<h5>Age: </h5>
					<p><span>Low: </span>{ageData[1]}<br/><span>Hight: </span>{ageData[0]}</p>
			</div>
			<div className="value">
				<h5>Bread: </h5>
					<p><span>Value: </span>{breadData[0]}<br/><span>Confidence: </span>{breadData[1]}</p>
			</div>		
		  </div>
		  <div>
		  	<div className="value">
				<h5>Emotion: </h5>
					<p><span>Value: </span>{emotionData[0]}<br/><span>Confidence: </span>{emotionData[1]}</p>
			</div>	
			<div className="value">
				<h5>Eyeglasses: </h5>
				<p><span>Value: </span>{eyeglassesData[0]}<br/><span>Confidence: </span>{eyeglassesData[1]}</p>
			</div>			
		  </div>
		  <div>
		  	<div className="value">
				<h5>EyesOpen: </h5>
				<p><span>Value: </span>{eyesOpenData[0]}<br/><span>Confidence: </span>{eyesOpenData[1]}</p>
			</div>
			<div className="value">
				<h5>Gender: </h5>
				<p><span>Value: </span>{genderData[0]}<br/><span>Confidence: </span>{genderData[1]}</p>
			</div>
		  </div>
		  <div>
		  	<div className="value">
				<h5>Smile: </h5>
				<p><span>Value: </span>{smileData[0]}<br/><span>Confidence: </span>{smileData[1]}</p>
			</div>
			<div className="value">
				<h5>MounthOpen: </h5>
				<p><span>Value: </span>{mouthOpenData[0]}<br/><span>Confidence: </span>{mouthOpenData[1]}</p>
			</div>
		  </div>
		  <div>
		  	<div className="value">
				<h5>Mustache: </h5>
				<p><span>Value: </span>{mustacheData[0]}<br/><span>Confidence: </span>{mustacheData[1]}</p>
			</div>
			<div className="value">
				<h5>Sunglasses: </h5>
				<p><span>Value: </span>{sunglassesData[0]}<br/><span>Confidence: </span>{sunglassesData[1]}</p>
			</div>
		  </div>
		  <div>
		  	<div className="value">
				<h5>Quality: </h5>
				<p><span>Brightness: </span>{qualityData[0]}<br/><span>Sharpness: </span>{qualityData[1]}</p>
			</div>
			<div className="value conf">
				<h5>Confidence: </h5><p>{confidenceData}</p>
		  	</div>
		  </div>
		</div>
	</div>
    </div>
  );
}

export default App;
