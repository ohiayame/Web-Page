import "./style/ParkingLayout.css";

export default function ParkingLayout() {
  return (
    <div className="parking-lot">
      {/* 상단 화살표 */}
      <div className="arrow left">▼</div>
      <div className="arrow right">▲</div>

      {/* 오른쪽 A구역 */}
      <div className="area-a">
        <div className="slot-a">A1</div>
        <div className="slot-a">A2</div>
        <div className="slot-a">A3</div>
        <div className="slot-a">A4</div>
        <div className="slot-a">A5</div>
        <div className="slot-a">A6</div>
      </div>

      {/* 중앙 B, C 구역 */}
      <div className="area-b">
        <div className="slot">B2</div>
        <div className="slot">B1</div>
        <div className="slot">B4</div>
        <div className="slot">B3</div>
      </div>
      <div className="area-c">
        <div className="slot">C2</div>
        <div className="slot">C1</div>
        <div className="slot">C4</div>
        <div className="slot">C3</div>
      </div>

      {/* 하단 D구역 */}
      <div className="area-d">
        <div className="slot">D9</div>
        <div className="slot">D8</div>
        <div className="slot">D7</div>
        <div className="slot">D6</div>
        <div className="slot">D5</div>
        <div className="slot">D4</div>
        <div className="slot">D3</div>
        <div className="slot">D2</div>
        <div className="slot">D1</div>
      </div>
    </div>
  );
}
