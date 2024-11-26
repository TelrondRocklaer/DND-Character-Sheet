"use client";

import React from "react";
import { RedocStandalone } from "redoc";

export default function ApiDocumentation() {
  return (
    <div className="fixed size-full overflow-y-scroll z-50">
      <RedocStandalone specUrl="http://localhost:5161/swagger/v1/swagger.json" options={{
        disableSearch: true,
        hideDownloadButton: true,
        hideHostname: true,
        hideLoading: true,
        theme: {
          spacing: {
            unit: 3,
          },
          breakpoints: {
            small: "40rem",
            medium: "52rem",
            large: "64rem",
          },
          colors: {
            primary: {
              main: "#c19976",
            },
            text: {
              primary: "#f9dbbdff",
            },
          },
          codeBlock: {
            backgroundColor: "#000000"
          },
          schema: {
            nestedBackground: "#210124ff",
            linesColor: "#c19976",
            typeNameColor: "#d62828ff",
            typeTitleColor: "#d62828ff",
          },
          sidebar: {
            backgroundColor: "#c19976",
            textColor: "#210124ff",
          },
          rightPanel: {
            backgroundColor: "#210124ff",
            textColor: "#f9dbbdff",
            width: "30%",
            servers: {
              overlay: {
                backgroundColor: "#000000",
                textColor: "#f9dbbdff",
              },
              url: {
                backgroundColor: "#000000",
              },
            },
          },
          fab: {
            backgroundColor: "#c19976",
            color: "#210124ff",
          },
        }
      }} />
    </div>
  );
}