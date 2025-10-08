import Layout from "@/layouts/Layout";
import InfoBox from "@/components/InfoBox";
import ParkingLayout from "@/components/ParkingLayout";

import { Stack, CardMedia, Box } from "@mui/material";

function HomePage() {
  const available = 15; // 주차가능 대수
  const total = 23;     // 총 주차 공간

  return (
    <Layout navUrl="/admin" val="AdminPage">
      <Stack
        direction="row"
        spacing={5}
        sx={{ mt: 5, alignItems: "flex-start" }}
      >
        {/* 주차 대수 */}
        <div>
          <Stack
            direction="column"
            spacing={10}
            sx={{ mt: 5, marginLeft: "100px" }}
          >
            {/* 계산 필요 */}
            <InfoBox label="주차가능 대수" value={available} />
            {/* 고정 값 */}
            <InfoBox label="총 주차 공간" value={total} />
          </Stack>

          {/* 로고 */}
          <CardMedia
            component="img"
            image="/YeungjinLogo.png"
            alt="Yeungjin Logo"
            sx={{ objectFit: "contain", p: 2, mt: 8, width: 500 }}
          />
        </div>

        {/* 주차장 Map */}
        <Box
          sx={{
            position: "fixed",
            top: "30px",
            left: "600px",
            borderRadius: 2,
            p: 2,
          }}
        >
          <ParkingLayout />
        </Box>
      </Stack>
    </Layout>
  );
}

export default HomePage;
