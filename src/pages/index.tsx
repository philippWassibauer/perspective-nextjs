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
        const worker = await perspective.worker();
        const websocket = await perspective.websocket(
          "ws://localhost:8080/websocket"
        );
        const server_table = await websocket.open_table("enhanced-midone");
        const view = await server_table.view();
        const server_view = await worker.table(view);
        const table = await worker.table(server_view);
        ref.current!.load(table);
      } catch (error) {
        console.log("error", error);
      }
    });
  }, [ref]);

  return <perspective-viewer ref={ref}></perspective-viewer>;
}
