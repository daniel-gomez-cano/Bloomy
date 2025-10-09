import React from "react";
import mapPlaceholder from "../assets/mapPlaceholder.svg";
import mapaValle from "../assets/mapaValle.png";

// Component: uses mapaValle if available, otherwise placeholder
export default function SplitSection({ imagePath }) {
  // Prefer explicit prop (imagePath), then local mapaValle import, then placeholder
  const imgSrc = imagePath || mapaValle || mapPlaceholder;

  return (
    <section className="split-section">
      <div className="panel-left">
        <div className="map-container">
          <img src={imgSrc} alt="Mapa del Valle del Cauca" style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
      </div>
      <div className="panel-right">
        <h1 className="content-title">Plantar en el Valle</h1>

        <div className="content-columns">
          <div className="column-text">
            <p>
              Es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos espécimen.
            </p>
            <p>
              No solo sobrevivió 500 años, sino que también ingresó como texto estándar de la industria moderna.
            </p>
          </div>
          <div className="column-text">
            <p>
              Es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos espécimen.
            </p>
            <p>
              Se ha mantenido a lo largo del tiempo, siendo un referente en el diseño editorial y web.
            </p>
          </div>
        </div>

        <div className="content-footer">
          <p>
            Es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor que se dedica a la labor editorial, lo usó para crear un ejemplar. Puedes usar este espacio para un llamado a la acción importante.
          </p>
        </div>
      </div>
    </section>
  );
}
