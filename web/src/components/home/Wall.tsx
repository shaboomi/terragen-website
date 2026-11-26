import styles from "@/generated/styles.json";

const ROWS = 3;

/** The wall: every built-in style, dealt into rows that scroll sideways. */
export function Wall() {
  const rows = Array.from({ length: ROWS }, (_, r) => styles.filter((_, i) => i % ROWS === r));
  return (
    <div className="wall" data-wall>
      {rows.map((row, r) => (
        <div
          key={r}
          className="wall__row"
          role="group"
          tabIndex={0}
          aria-label={`Styles, row ${r + 1} of ${ROWS}. Scroll sideways for more.`}
        >
          <ul>
            {row.map((s) => (
              <li key={s.id} className="tile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt="" width={s.width} height={s.height} loading="lazy" decoding="async" />
                <span className="tile__name">
                  {s.name}
                  <span className="vh">, {s.group.toLowerCase()}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
