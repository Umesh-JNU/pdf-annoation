import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import Box from "./Box";

const PdfPage = () => {
  const { pdf } = useParams();

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const canvasRef = useRef();
  const [drawing, setDrawing] = useState(false);
  const [box, setBox] = useState([]);
  const [mouse, setMouse] = useState({
    x1: null,
    x2: null,
    y1: null,
    y2: null,
    type: null,
  });

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setBox([]);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  const insertBox = (newBox) => {
    const data = localStorage.getItem("box")
      ? JSON.parse(localStorage.getItem("box"))
      : [];

    localStorage.setItem(
      "box",
      JSON.stringify([...data, { ...newBox, pdf: pdf, pageNo: pageNumber }])
    );
  };

  const getAllBox = () => {
    const data = JSON.parse(localStorage.getItem("box")) || [];
    // console.log(data);
    const boxes = data.filter((a) => a.pdf === pdf && a.pageNo === pageNumber);
    // console.log(boxes);

    setBox(boxes);
  };
  const mouseDownHandler = (e) => {
    if (!mouse.type) return;

    setDrawing(true);
    const { layerX, layerY } = e.nativeEvent;
    if (!mouse.x1 && !mouse.y1) {
      setMouse({ ...mouse, x1: layerX, y1: layerY });
    }
  };

  const drawBox = useCallback(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);

    box.forEach(({ x1, y1, x2, y2, type }) => {
      context.beginPath();
      context.rect(x1, y1, x2 - x1, y2 - y1);
      context.fillStyle = type;
      context.fill();
    });
  }, [box]);

  const mouseMoveHandler = (e) => {
    if (drawing && mouse.x1 && mouse.y1) {
      const { layerX, layerY } = e.nativeEvent;
      mouse.x2 = layerX;
      mouse.y2 = layerY;

      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, width, height);
      drawBox();
      context.beginPath();
      context.rect(
        mouse.x1,
        mouse.y1,
        mouse.x2 - mouse.x1,
        mouse.y2 - mouse.y1
      );
      context.fillStyle = mouse.type;
      context.fill();
    }
  };
  const mouseUpHandler = (e) => {
    if (!mouse.type) return;

    setDrawing(false);
    insertBox(mouse);
    // console.log(box);
    setBox((preBoxes) => [...preBoxes, { ...mouse }]);

    setMouse({ x1: null, x2: null, y1: null, y2: null, type: null });
  };

  const canvasDimHandler = () => {
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();
    setWidth(width);
    setHeight(height);
    getAllBox();
  };

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    if (box.length) drawBox();
  }, [box, drawBox]);

  return (
    <div className="container">
      <div className="left">
        <div className="top-section">
          <div className="css-sub-heading">Labels</div>
          <div className="btn-container">
            <button
              onClick={() => {
                setMouse({ ...mouse, type: "#ff744170" });
              }}
            >
              Title
            </button>
            <button onClick={() => setMouse({ ...mouse, type: "#1aff1a7d" })}>
              Author
            </button>
          </div>
        </div>
        <div className="bottom-section">
          <div className="css-sub-heading">Boxes</div>
          {box.length && box.map((bx, i) => <Box key={i} {...bx} />)}
        </div>
      </div>
      <div className="right">
        <canvas
          className="canvas-wrapper"
          id="canvas"
          width={width}
          height={height}
          onMouseDown={mouseDownHandler}
          onMouseUp={mouseUpHandler}
          onMouseMove={mouseMoveHandler}
        ></canvas>
        <div style={{ zIndex: 0 }}>
          <Document
            file={`https://arxiv.org/pdf/${pdf}.pdf`}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page
              pageNumber={pageNumber}
              canvasRef={canvasRef}
              onLoadSuccess={canvasDimHandler}
            />
          </Document>
        </div>
        <div className="bottom-menu">
          <button
            className="page-btn"
            type="button"
            disabled={pageNumber <= 1}
            onClick={() => changePage(-1)}
          >
            {"<<"}
          </button>
          <p>
            Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
          </p>
          <button
            className="page-btn"
            type="button"
            disabled={pageNumber >= numPages}
            onClick={() => changePage(1)}
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfPage;
