import React from "react";
import "@finos/perspective-viewer/dist/css/themes.css";
import type { HTMLPerspectiveViewerElement } from "@finos/perspective-viewer";

export default function Home() {
  const ref = React.useRef<HTMLPerspectiveViewerElement>(null);
  React.useEffect(() => {
    Promise.all([
      import("@finos/perspective-viewer"),
      //import("@finos/perspective-viewer-xy-scatter"),
      import("@finos/perspective-viewer-datagrid"),
      import("@finos/perspective-viewer-d3fc"),
      import("@finos/perspective"),
      // @ts-ignore
      import("superstore-arrow/superstore.arrow"),
    ]).then(async ([_, __, ___, perspective, arr]) => {
      try {
        const worker = perspective.worker();
        const websocket = perspective.websocket(
          "ws://localhost:8080/websocket"
        );
        const server_table = await websocket.open_table("enhanced-midone");
        // Anything calling the table, like .view, .schema just hangs
        const view = await server_table.view({});
        console.log("got view");
        const client_table = await worker.table(view);
        const table = worker.table(arr.default.slice());
        ref.current!.load(table);
        console.log("-------------------------------------");
      } catch (error) {
        console.log("error", error);
      }
    });
  }, [ref]);

  return <perspective-viewer ref={ref}></perspective-viewer>;
}
