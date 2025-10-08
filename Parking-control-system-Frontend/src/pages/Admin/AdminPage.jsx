import Layout from "@/layouts/Layout";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { getCarData } from "../../api/mock";

// ---------- Mock 데이터 ----------
const mockData = getCarData();

// ---- 시간 (2025-10-08T08:45:00 -> 25.10.08 08:45) ----
const dateAndTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${yy}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} 
  ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const statusSx = (s) => {
  const base = {
    fontWeight: 700,
    width: "200px",
    px: 1.5,
    py: 0.25,
    borderRadius: "9999px",
    display: "inline-block",
  };
  if (s === "입차") return { ...base, bgcolor: "#fff176" }; // 노랑
  if (s === "주차중") return { ...base, bgcolor: "#ffcdd2" }; // 핑크
  if (s === "출차") return { ...base, bgcolor: "#e0e0e0" }; // 회색
  return base;
};

// 입력창 스타일(둥근 모서리, 연한 배경, 검은 테두리)
const inputSx = {
  width: 230,
  "& .MuiOutlinedInput-root": {
    borderRadius: "18px",
    backgroundColor: "#eef7fb",
    "& fieldset": { borderColor: "black", borderWidth: 4 },
    "&:hover fieldset": { borderColor: "black" },
    "&.Mui-focused fieldset": { borderColor: "black", borderWidth: 4 },
    "& input": { py: 2 },
  },
};

function AdminPage() {
  const navigate = useNavigate();

  // 검색 필터
  const [number, setNumber] = useState("");
  const [from, setFrom] = useState(""); // yyyy-mm-dd
  const [to, setTo] = useState("");

  // 필터링
  const rows = useMemo(() => {
    const start = from ? new Date(from + "T00:00:00") : null;
    const end = to ? new Date(to + "T23:59:59") : null;
    return mockData.filter((r) => {
      const passNumber = number ? r.number.includes(number) : true;
      const t = new Date(r.entryAt);
      const passFrom = start ? t >= start : true;
      const passTo = end ? t <= end : true;
      return passNumber && passFrom && passTo;
    });
  }, [number, from, to]);

  return (
    <Layout navUrl="/" val="돌아가기">
      <h1 style={{ fontSize: "50px", fontWeight: 800, marginLeft: "10px" }}>
        AdminPage
      </h1>
      <Box sx={{ p: 3 }}>
        {/* --------------------------------------  [ 검색 ]  -------------------------------------- */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ mb: 2, ml: 17, flexWrap: "wrap" }}
        >
          {/* 아이콘 */}
          <QueryStatsIcon fontSize="large" />
          {/*   번호 검색   */}
          <Typography sx={{ mr: 1.5, minWidth: 40, fontSize: "2rem" }}>
            번호 :
          </Typography>
          <TextField
            placeholder="예) 1234"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            sx={inputSx}
          />
          {/*   일시 검색   [ from ~ to ] */}
          <Typography sx={{ mr: 1.5, minWidth: 40, fontSize: "2rem" }}>
            일시 :
          </Typography>
          <TextField
            type="date"
            size="small"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            sx={{ ...inputSx, width: 200 }}
          />
          <Typography sx={{ mx: 1, fontSize: "2rem" }}>~</Typography>{" "}
          {/*    ~    */}
          <TextField
            type="date"
            size="small"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            sx={{ ...inputSx, width: 200 }}
          />
        </Stack>

        {/* --------------------------------------  [ 테이블 ]  -------------------------------------- */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            p: 3,
            ml: 28,
            width: 1800,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontSize: "3rem", pb: 3 }}>
                  주차 상태
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "3rem", pb: 3 }}>
                  번호
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "3rem", pb: 3 }}>
                  주차구역
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "3rem", pb: 3 }}>
                  입차 시각
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "3rem", pb: 3 }}>
                  출차 시각
                </TableCell>
              </TableRow>
            </TableHead>

            {/* 행 클릭 -> 해당 차량 log페이지 이동 :carId */}
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/admin/carInfo/${row.id}`)}
                >
                  {/* 주차 상태 */}
                  <TableCell align="center" sx={{ fontSize: "2.5rem" }}>
                    <Box component="span" sx={statusSx(row.status)}>
                      {row.status}
                    </Box>
                  </TableCell>

                  {/* 번호 */}
                  <TableCell align="center" sx={{ fontSize: "2.5rem" }}>
                    {row.number}
                  </TableCell>

                  {/* 주차구역 */}
                  <TableCell align="center" sx={{ fontSize: "2.5rem" }}>
                    {row.area}
                  </TableCell>

                  {/* 입차 시각 */}
                  <TableCell align="center" sx={{ fontSize: "2.5rem" }}>
                    {dateAndTime(row.entryAt)}
                  </TableCell>

                  {/* 출차 시각 */}
                  <TableCell align="center" sx={{ fontSize: "2.5rem" }}>
                    {dateAndTime(row.exitAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
}

export default AdminPage;
