import Layout from "@/layouts/Layout";
import { useParams } from "react-router-dom";
import { Box, Stack, Typography, Paper } from "@mui/material";
import ParkingLayout from "@/components/ParkingLayout";

import { getCarData } from "../../api/mock";

// ---------- Mock 데이터 ----------
const mockCars = getCarData();

const statusSx = (s) => {
  const base = {
    fontWeight: 700,
    width: "35%",
    px: 6,
    py: 3,
    borderRadius: "30px",
    display: "flex",
    justifyContent: "center",
    // display: "inline-block",
    fontSize: "4rem",
  };
  if (s === "입차") return { ...base, bgcolor: "#fff176" };
  if (s === "주차중") return { ...base, bgcolor: "#ffcdd2" };
  if (s === "출차") return { ...base, bgcolor: "#e0e0e0" };
  return base;
};

// ---- 시간 (2025-10-08T08:45:00 -> 25.10.08 08:45) ----
const dateAndTime = (iso) => {
  if (!iso) return "0000.00.00 00:00";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

function CarInfo() {
  const { carId } = useParams(); // url :carId
  console.log("carId", carId);

  // 존재하는지 확인
  const car = mockCars.find((c) => c.id === Number(carId));

  if (!car) {
    return (
      <Layout navUrl="/admin" val="돌아가기">
        <Typography sx={{ p: 5 }}>
          해당 차량 정보를 찾을 수 없습니다.
        </Typography>
      </Layout>
    );
  }

  return (
    <Layout navUrl="/admin" val="돌아가기">
      <Stack
        direction="row"
        spacing={5}
        sx={{ mt: 5, alignItems: "flex-start", ml: "30px" }}
      >
        {/* -----------------------  [ 주차 정보 ]  ----------------------- */}
        <Stack sx={{ mt: 5, minWidth: 300 }}>
          {/* 상태 (입차, 주차중, 출차) */}
          <Box sx={statusSx(car.status)}>{car.status}</Box>

          {/* 차량 사진 */}
          <Paper
            sx={{
              mt: 6,
              width: 440,
              height: 230,
              bgcolor: "black",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {car.image ? <img src={car.image} alt="차량 사진" /> : "차량 사진"}
          </Paper>

          {/* 차량 정보 */}
          <Paper
            sx={{
              mt: 10,
              p: 4,
              pr: 8,
              border: "5px solid black",
              borderRadius: 12,
              bgcolor: "#fffde7",
              fontSize: "2.5rem",
              lineHeight: 2,
            }}
          >
            번호 : {car.number}
            <br />
            주차구역 : {car.area}
            <br />
            입차시각 : {dateAndTime(car.entryAt)}
            <br />
            출차시각 : {dateAndTime(car.exitAt)}
          </Paper>
        </Stack>

        {/* --------------------  [ 주차 로그 ]  -------------------- */}
        <Box
          sx={{
            position: "fixed",
            top: "30px",
            left: "600px",
            borderRadius: 2,
            p: 2,
            bgcolor: "#f5f9ff",
          }}
        >
          {/* 주차장 컴포넌트 */}
          <ParkingLayout selectedArea={car.area} />
        </Box>
      </Stack>
    </Layout>
  );
}

export default CarInfo;
