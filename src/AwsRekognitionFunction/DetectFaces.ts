import { DetectFacesCommand } from "@aws-sdk/client-rekognition";
import { rekognitionClient } from './rekognitionClient'

export const DetectFaces = async (imageData:Uint8Array) => {
    var params = {
      Image: {
        Bytes: imageData,
      },
      Attributes: ["ALL"],
    };
    try {
      const data = await rekognitionClient.send(new DetectFacesCommand(params));
      return data;	   
    } catch (err) {
      console.log("Error", err);
    }
    
  };