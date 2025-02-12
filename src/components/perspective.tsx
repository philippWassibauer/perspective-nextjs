"use client";
import React from "react";
import "@finos/perspective-viewer/dist/css/themes.css";
import perspective from "@finos/perspective";
import "@finos/perspective-viewer-d3fc/dist/cdn/perspective-viewer-d3fc.js";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer";
import { scatterLinePlugin } from "@/utils/scatterLineSimple";
import {
  HTMLPerspectiveViewerElement,
  ViewerConfigUpdate,
} from "@finos/perspective-viewer";
import superstore from "superstore-arrow/superstore.arrow";

const config: ViewerConfigUpdate = {
  version: "3.3.3",
  plugin: "X/Y Scatter",
  plugin_config: {
    legend: {
      pageIndex: 0,
    },
  },
  columns_config: {},
  settings: true,
  theme: "Pro Dark",
  title: "Mid-One",
  group_by: [],
  split_by: [],
  columns: ["utc", "skew_mid", "dest", null, null, null, null],
  filter: [["securityId", "==", "USD/JPY"]],
  sort: [["utc", "asc"]],
  expressions: {},
  aggregates: {},
};

export const Perspective = (): React.ReactElement => {
  const viewer = React.useRef<HTMLPerspectiveViewerElement>(null);

  React.useEffect(() => {
    async function initialize() {
      try {
        const worker = await perspective.worker();
        const websocket = await perspective.websocket(
          "ws://16.170.244.83:8080/websocket"
        );
        // TODO: Comment/Uncomment this when the websocket server is running
        //const table = worker.table(superstore.slice());
        const server_table = await websocket.open_table("enhanced midone");
        const server_view = await server_table.view();
        const table = await worker.table(server_view);

        viewer.current!.load(table);
        viewer.current!.restore(config);
        //viewer.current!.registerPlugin("scatterLine", scatterLinePlugin);
      } catch (error) {
        console.log("error", error);
      }
    }
    initialize();
  }, []);

  return <perspective-viewer ref={viewer}></perspective-viewer>;
};
