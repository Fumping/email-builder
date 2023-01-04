import React, { useEffect, useRef } from "react";
import EmailEditor from "react-email-editor";
import testTemplateJson from "./saved-templates/hikeLights1Template.json";
import styled from 'styled-components';


//import testTemplateJson from "./test-template.json";
export const App = (props) => {
  const emailEditorRef = useRef(null);
const Bar = styled.div`
  flex: 1;
  background-color: #000000;
  color: #fff;
  padding: 10px;
  display: flex;
  max-height: 40px;
  h1 {
    flex: 1;
    font-size: 16px;
    text-align: left;
  }
  button {
    flex: 1;
    padding: 10px;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    background-color: #e0257b;
    color: #fff;
    border: 0px;
    max-width: 150px;
    cursor: pointer;
  }
`;
const Logo = styled.div`
  flex: 1; 
  img { width:160px; }
`;
  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      console.log("exportHtml", html);

      let link = document.createElement("a");
      // ToLearn: what is createObjectURL and Blob, and octet stream
      link.href = window.URL.createObjectURL(
        new Blob([html], { type: "application/octet-stream" })
      );
      link.download = "email.html";

      document.body.appendChild(link);

      link.click();
      setTimeout(function () {
        window.URL.revokeObjectURL(link);
      }, 200);
    });
  };

  const saveDesign = () => {
    emailEditorRef.current.editor.saveDesign((design) => {
      console.log("saveDesign", design);

      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(
        new Blob([JSON.stringify(design)], { type: "application/json" })
      );
      link.download = "emailDesign.json";

      document.body.appendChild(link);

      link.click();
      setTimeout(function () {
        window.URL.revokeObjectURL(link);
      }, 200);
    });
  };

  const onLoad = () => {
    // editor instance is created
    // you can load your template here;
    const templateJson = testTemplateJson;
    emailEditorRef.current.editor.loadDesign(templateJson);
    
  };

  const onReady = () => {
    // editor is ready
    console.log("onReady");
    console.log(emailEditorRef.current.editor);
    emailEditorRef.current.editor.addEventListener("keydown", (e) => {
      console.log(e);
      e.preventDefault();
      if ((e.metaKey || e.ctrlKey) && e.code === "KeyS") {
        console.log("fire!");
      }
    });

    // Error: blocked "http://localhost:3000" from accessing a cross-origin frame.
    // emailEditorRef.current.editor.frame.iframe.contentWindow.document.addEventListener(
    //   "keydown",
    //   (e) => {
    //     console.log(e);
    //     e.preventDefault();
    //     if ((e.metaKey || e.ctrlKey) && e.code === "KeyS") {
    //       console.log("fire!");
    //     }
    //   }
    // );
  };

  return (
    <div>
      <Bar>
        <Logo><img src="gladior-logo.svg"/></Logo>
        <h1>Gladior Email Builder</h1>
        <button onClick={exportHtml}>Export HTML</button>
        <button onClick={saveDesign}>Save Design</button>
      </Bar>

      <EmailEditor
        ref={emailEditorRef}
        onLoad={onLoad}
        onReady={onReady}
        minHeight={"95vh"}
        options={{
          customJS: [
            window.location.protocol + '//' + window.location.host + '/custom.js',
          ],
        tools: {
              'custom#my_tool': {
                  data: {
                      customHostUrl: window.location.origin
                  }
              }
          },
        }}
      />
    </div>
  );
};
