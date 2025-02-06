"use client";
import React from "react";
import "@finos/perspective-viewer/dist/css/themes.css";
import perspective from "@finos/perspective";
import "@finos/perspective-viewer-d3fc/dist/cdn/perspective-viewer-d3fc.js";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer";
import {
  HTMLPerspectiveViewerElement,
  ViewerConfigUpdate,
} from "@finos/perspective-viewer";
import superstore from "superstore-arrow/superstore.arrow";

const config: ViewerConfigUpdate = {
  plugin: "Y Area",
  plugin_config: {
    legend: {
      height: "106px",
      left: "100px",
      top: "25px",
      width: "",
    },
  },
};

export const Perspective = (): React.ReactElement => {
  const viewer = React.useRef<HTMLPerspectiveViewerElement>(null);

  React.useEffect(() => {
    async function initialize() {
      try {
        const worker = await perspective.worker();

        // TODO: Comment/Uncomment this when the websocket server is running
        const table = worker.table(superstore.slice());
        // const server_table = await websocket.open_table("enhanced-midone");
        // const server_view = await server_table.view();
        // const table = await worker.table(server_view);

        viewer.current!.load(table);
        viewer.current!.restore(config);
      } catch (error) {
        console.log("error", error);
      }
    }
    initialize();
  }, []);

  return <perspective-viewer ref={viewer}></perspective-viewer>;
};
