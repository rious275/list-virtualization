import { faker } from "@faker-js/faker";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CSSProperties, useRef } from "react";

const randomNumber = (min: number, max: number) =>
  faker.number.int({ min, max });

const sentences = new Array(100)
  .fill(true)
  .map(() => faker.lorem.sentence(randomNumber(20, 70)));

function App() {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: sentences.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  const list = virtualizer.getVirtualItems();

  const style: Record<"container" | "list", CSSProperties> = {
    container: {
      position: "relative",
      height: 400,
      width: 400,
      overflowY: "auto",
      contain: "strict",
    },
    list: {
      position: "absolute",
      top: 0,
      left: 0,
      transform: `translateY(${list[0]?.start ?? 0}px)`,
      height: virtualizer.getTotalSize(),
    },
  };

  return (
    <>
      <button
        onClick={() => {
          virtualizer.scrollToIndex(100);
        }}
      >
        scroll to the index
      </button>

      <div ref={parentRef} style={style.container}>
        <ul style={style.list}>
          {list.map(virtualRow => {
            return (
              <li
                key={virtualRow.key}
                ref={virtualizer.measureElement}
                data-index={virtualRow.index}
              >
                <p style={{ margin: 0 }}>
                  {virtualRow.index + 1}. {sentences[virtualRow.index]}
                </p>
                <br />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default App;
