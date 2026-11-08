/* Lõi tính toán: lịch âm (thuật toán Hồ Ngọc Đức), Can Chi, ngũ hành, Bát trạch, chọn ngày.
   Không phụ thuộc trình duyệt, chạy được cả trong Node để kiểm tra. */
(function (root) {
  'use strict';
  const INT = Math.floor;
  const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  const CON_GIAP = ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'];
  const HANH = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];
  const CHI_HANH = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
  const GIO = ['23h–1h', '1h–3h', '3h–5h', '5h–7h', '7h–9h', '9h–11h', '11h–13h', '13h–15h', '15h–17h', '17h–19h', '19h–21h', '21h–23h'];
  const TIET_KHI = ['Xuân phân', 'Thanh minh', 'Cốc vũ', 'Lập hạ', 'Tiểu mãn', 'Mang chủng', 'Hạ chí', 'Tiểu thử', 'Đại thử', 'Lập thu', 'Xử thử', 'Bạch lộ', 'Thu phân', 'Hàn lộ', 'Sương giáng', 'Lập đông', 'Tiểu tuyết', 'Đại tuyết', 'Đông chí', 'Tiểu hàn', 'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập'];
  const NAP_AM = ['Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim', 'Sơn Đầu Hỏa', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc', 'Tuyền Trung Thủy', 'Ốc Thượng Thổ', 'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy', 'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bích Thượng Thổ', 'Kim Bạch Kim', 'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim', 'Tang Đố Mộc', 'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy'];
  const THAN = ['Thanh Long', 'Minh Đường', 'Thiên Hình', 'Chu Tước', 'Kim Quỹ', 'Kim Đường', 'Bạch Hổ', 'Ngọc Đường', 'Thiên Lao', 'Huyền Vũ', 'Tư Mệnh', 'Câu Trận'];
  const THAN_TOT = [true, true, false, false, true, true, false, true, false, false, true, false];
  const TRUC = ['Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp', 'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế'];
  // Giờ hoàng đạo theo chi ngày (Tý..Hợi), '1' là giờ tốt
  const GIO_HD = ['110100101100', '001101001011', '110011010010', '101100110100', '001011001101', '010010110011'];

  /* ---------- Lịch âm ---------- */
  function jdFromDate(dd, mm, yy) {
    const a = INT((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
    let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
    if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
    return jd;
  }
  function jdToDate(jd) {
    let b, c;
    if (jd > 2299160) { const a = jd + 32044; b = INT((4 * a + 3) / 146097); c = a - INT((b * 146097) / 4); }
    else { b = 0; c = jd + 32082; }
    const d = INT((4 * c + 3) / 1461), e = c - INT((1461 * d) / 4), m = INT((5 * e + 2) / 153);
    return [e - INT((153 * m + 2) / 5) + 1, m + 3 - 12 * INT(m / 10), b * 100 + d - 4800 + INT(m / 10)];
  }
  function newMoon(k) {
    const T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = Math.PI / 180;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    const deltat = T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2;
    return Jd1 + C1 - deltat;
  }
  function sunLongitude(jdn) { // radian
    const T = (jdn - 2451545.0) / 36525, T2 = T * T, dr = Math.PI / 180;
    const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    let L = (L0 + DL) * dr;
    L -= Math.PI * 2 * INT(L / (Math.PI * 2));
    return L;
  }
  const getSunLong = (dayNumber, tz) => INT(sunLongitude(dayNumber - 0.5 - tz / 24) / Math.PI * 6);
  const getNewMoonDay = (k, tz) => INT(newMoon(k) + 0.5 + tz / 24);
  function getLunarMonth11(yy, tz) {
    const off = jdFromDate(31, 12, yy) - 2415021, k = INT(off / 29.530588853);
    let nm = getNewMoonDay(k, tz);
    if (getSunLong(nm, tz) >= 9) nm = getNewMoonDay(k - 1, tz);
    return nm;
  }
  function getLeapMonthOffset(a11, tz) {
    const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last, i = 1, arc = getSunLong(getNewMoonDay(k + i, tz), tz);
    do { last = arc; i++; arc = getSunLong(getNewMoonDay(k + i, tz), tz); } while (arc !== last && i < 14);
    return i - 1;
  }
  function solarToLunar(dd, mm, yy, tz) {
    const dayNumber = jdFromDate(dd, mm, yy);
    const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1, tz);
    if (monthStart > dayNumber) monthStart = getNewMoonDay(k, tz);
    let a11 = getLunarMonth11(yy, tz), b11 = a11, lunarYear;
    if (a11 >= monthStart) { lunarYear = yy; a11 = getLunarMonth11(yy - 1, tz); }
    else { lunarYear = yy + 1; b11 = getLunarMonth11(yy + 1, tz); }
    const lunarDay = dayNumber - monthStart + 1, diff = INT((monthStart - a11) / 29);
    let lunarLeap = false, lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      const leapDiff = getLeapMonthOffset(a11, tz);
      if (diff >= leapDiff) { lunarMonth = diff + 10; if (diff === leapDiff) lunarLeap = true; }
    }
    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
    return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap, jd: dayNumber };
  }

  /* ---------- Can Chi, ngũ hành ---------- */
  const mod = (a, n) => ((a % n) + n) % n;
  const yearCan = y => mod(y + 6, 10), yearChi = y => mod(y + 8, 12);
  const dayCan = jd => mod(jd + 9, 10), dayChi = jd => mod(jd + 1, 12);
  const monthCan = (ly, lm) => mod(ly * 12 + lm + 3, 10), monthChi = lm => mod(lm + 1, 12);
  const hourCan = (jd, h) => mod(dayCan(jd) * 2 + h, 10);
  const canChi = (c, z) => CAN[c] + ' ' + CHI[z];
  function napAm(c, z) {
    const idx = mod(6 * c - 5 * z, 60), name = NAP_AM[INT(idx / 2)];
    return { name, hanh: HANH.indexOf(name.split(' ').pop()) };
  }
  // quan hệ ngũ hành a → b
  function nguHanhRel(a, b) {
    if (a === b) return 'hòa';
    if (mod(a + 1, 5) === b) return 'sinh';      // a sinh b
    if (mod(b + 1, 5) === a) return 'được sinh'; // b sinh a
    if (mod(a + 2, 5) === b) return 'khắc';      // a khắc b
    return 'bị khắc';
  }
  function chiRel(a, b) {
    const out = [];
    if (a === b) out.push({ t: 'Cùng tuổi', good: null });
    if (mod(a - b, 12) === 6) out.push({ t: 'Lục xung', good: false });
    if (a !== b && a % 4 === b % 4) out.push({ t: 'Tam hợp', good: true });
    if (mod(a + b, 12) === 1) out.push({ t: 'Lục hợp', good: true });
    if (mod(a + b, 12) === 7) out.push({ t: 'Lục hại', good: false });
    if (a !== b && a % 3 === b % 3 && mod(a - b, 12) !== 6) out.push({ t: 'Tứ hành xung', good: false });
    return out;
  }
  const isXung = (a, b) => mod(a - b, 12) === 6;
  const canKhac = (a, b) => { const r = nguHanhRel(INT(a / 2), INT(b / 2)); return r === 'khắc' || r === 'bị khắc'; };

  /* ---------- Bát trạch ---------- */
  const HUONG = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
  const QUAI = { 1: ['Khảm', 'Bắc', 4], 2: ['Khôn', 'Tây Nam', 2], 3: ['Chấn', 'Đông', 0], 4: ['Tốn', 'Đông Nam', 0], 6: ['Càn', 'Tây Bắc', 3], 7: ['Đoài', 'Tây', 3], 8: ['Cấn', 'Đông Bắc', 2], 9: ['Ly', 'Nam', 1] };
  const SAO = [
    { n: 'Sinh Khí', good: true, y: 'Tài lộc, danh tiếng, sức sống' },
    { n: 'Thiên Y', good: true, y: 'Sức khỏe, quý nhân giúp đỡ' },
    { n: 'Diên Niên', good: true, y: 'Gia đạo hòa thuận, bền lâu' },
    { n: 'Phục Vị', good: true, y: 'Bình yên, vững vàng' },
    { n: 'Họa Hại', good: false, y: 'Thị phi, trắc trở nhỏ' },
    { n: 'Ngũ Quỷ', good: false, y: 'Hao tài, tranh chấp' },
    { n: 'Lục Sát', good: false, y: 'Tình cảm, kiện tụng không yên' },
    { n: 'Tuyệt Mệnh', good: false, y: 'Xấu nhất, bệnh tật, mất mát' },
  ];
  // Thứ tự: Sinh Khí, Thiên Y, Diên Niên, Phục Vị, Họa Hại, Ngũ Quỷ, Lục Sát, Tuyệt Mệnh
  const BAT_TRACH = {
    1: ['Đông Nam', 'Đông', 'Nam', 'Bắc', 'Tây', 'Đông Bắc', 'Tây Bắc', 'Tây Nam'],
    9: ['Đông', 'Đông Nam', 'Bắc', 'Nam', 'Đông Bắc', 'Tây', 'Tây Nam', 'Tây Bắc'],
    3: ['Nam', 'Bắc', 'Đông Nam', 'Đông', 'Tây Nam', 'Tây Bắc', 'Đông Bắc', 'Tây'],
    4: ['Bắc', 'Nam', 'Đông', 'Đông Nam', 'Tây Bắc', 'Tây Nam', 'Tây', 'Đông Bắc'],
    6: ['Tây', 'Đông Bắc', 'Tây Nam', 'Tây Bắc', 'Đông Nam', 'Đông', 'Bắc', 'Nam'],
    2: ['Đông Bắc', 'Tây', 'Tây Bắc', 'Tây Nam', 'Đông', 'Đông Nam', 'Nam', 'Bắc'],
    8: ['Tây Nam', 'Tây Bắc', 'Tây', 'Đông Bắc', 'Nam', 'Bắc', 'Đông', 'Đông Nam'],
    7: ['Tây Bắc', 'Tây Nam', 'Đông Bắc', 'Tây', 'Bắc', 'Nam', 'Đông Nam', 'Đông'],
  };
  // Cung phi theo năm âm lịch. Nam/nữ số 5 gửi cung Khôn/Cấn (cách tính phổ biến ở VN).
  function cungPhi(lunarYear, male) {
    let k = male ? mod(11 - mod(lunarYear, 9), 9) : mod(mod(lunarYear, 9) + 4, 9);
    if (k === 0) k = 9;
    if (k === 5) k = male ? 2 : 8;
    const q = QUAI[k];
    const dirs = {};
    BAT_TRACH[k].forEach((h, i) => { dirs[h] = SAO[i]; });
    return { so: k, ten: q[0], huongGoc: q[1], hanh: HANH[q[2]], nhom: [1, 3, 4, 9].includes(k) ? 'Đông tứ mệnh' : 'Tây tứ mệnh', dirs, list: BAT_TRACH[k] };
  }

  /* ---------- Hồ sơ một người ---------- */
  function person(dateStr, male, tz, label) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const L = solarToLunar(d, m, y, tz);
    return personFromLunarYear(L.year, male, label, L);
  }
  function personFromLunarYear(ly, male, label, lunar) {
    const c = yearCan(ly), z = yearChi(ly), na = napAm(c, z);
    return { label, male, lunarYear: ly, lunar, can: c, chi: z, ten: canChi(c, z), conGiap: CON_GIAP[z], napAm: na, cung: cungPhi(ly, male) };
  }
  const tuoiMu = (p, lunarYear) => lunarYear - p.lunarYear + 1;
  function kimLau(age) {
    const r = age % 9;
    const map = { 1: 'Kim Lâu Thân (ảnh hưởng bản thân)', 3: 'Kim Lâu Thê (ảnh hưởng vợ/chồng)', 6: 'Kim Lâu Tử (ảnh hưởng con cái)', 8: 'Kim Lâu Lục Súc (ảnh hưởng tài sản, vật nuôi)' };
    return map[r] ? { pham: true, ten: map[r] } : { pham: false };
  }
  const HOANG_OC = [['Nhất Cát', true, 'Tốt, làm nhà yên ổn'], ['Nhì Nghi', true, 'Tốt, dễ làm ăn'], ['Tam Địa Sát', false, 'Xấu, dễ ốm đau'], ['Tứ Tấn Tài', true, 'Tốt, tiền của vào'], ['Ngũ Thọ Tử', false, 'Xấu, chia ly'], ['Lục Hoang Ốc', false, 'Xấu, khó thành nhà']];
  function hoangOc(age) { const h = HOANG_OC[mod(INT(age / 10) - 1 + (age % 10), 6)]; return { ten: h[0], tot: h[1], y: h[2] }; }
  function tamTai(p, yearChiIdx) {
    const start = { 0: 2, 2: 8, 1: 11, 3: 5 }[p.chi % 4];
    const years = [start, mod(start + 1, 12), mod(start + 2, 12)];
    return { pham: years.includes(yearChiIdx), years: years.map(i => CHI[i]) };
  }

  /* ---------- Thông tin một ngày ---------- */
  function sunDeg(jd, tz) { return sunLongitude(jd - 0.5 - tz / 24) * 180 / Math.PI; }
  function dayInfo(d, m, y, tz) {
    const L = solarToLunar(d, m, y, tz), jd = L.jd;
    const dc = dayCan(jd), dz = dayChi(jd);
    const deg = sunDeg(jd + 1, tz); // cuối ngày
    const tiet = TIET_KHI[INT(deg / 15)];
    const thangTietChi = mod(INT(mod(sunDeg(jd, tz) - 315, 360) / 30) + 2, 12);
    const truc = TRUC[mod(dz - thangTietChi, 12)];
    const thanIdx = mod(dz - mod(L.month - 1, 6) * 2, 12);
    const gio = [];
    for (let h = 0; h < 12; h++) gio.push({ chi: h, ten: CHI[h], can: hourCan(jd, h), khung: GIO[h], tot: GIO_HD[dz % 6][h] === '1' });
    return {
      solar: { d, m, y }, lunar: L, jd, dow: mod(jd + 1, 7), // 0 = Chủ nhật
      canNgay: dc, chiNgay: dz, ngay: canChi(dc, dz),
      thang: canChi(monthCan(L.year, L.month), monthChi(L.month)), nam: canChi(yearCan(L.year), yearChi(L.year)),
      than: THAN[thanIdx], hoangDao: THAN_TOT[thanIdx], truc, tiet, gio,
      tamNuong: [3, 7, 13, 18, 22, 27].includes(L.day), nguyetKy: [5, 14, 23].includes(L.day),
      hanhNgay: napAm(dc, dz),
    };
  }

  /* ---------- Chấm điểm ngày theo việc ---------- */
  const TRUC_VIEC = {
    cuoi: { tot: ['Định', 'Thành', 'Khai'], xau: ['Kiến', 'Phá', 'Nguy', 'Bế'] },
    nha: { tot: ['Định', 'Thành', 'Mãn'], xau: ['Phá', 'Nguy', 'Khai', 'Bế'] },
    tang: { tot: ['Trừ', 'Định', 'Thành'], xau: ['Kiến', 'Phá', 'Khai'] },
  };
  const TRUNG_TANG = ['Giáp', 'Ất', 'Mậu', 'Bính', 'Đinh', 'Kỷ', 'Canh', 'Tân', 'Mậu', 'Nhâm', 'Quý', 'Kỷ'];
  const TRUNG_PHUC = ['Canh', 'Tân', 'Kỷ', 'Nhâm', 'Quý', 'Mậu', 'Giáp', 'Ất', 'Kỷ', 'Bính', 'Đinh', 'Mậu'];

  function scoreDay(info, viec, people) {
    let s = 0, cam = false;
    const tot = [], xau = [];
    if (info.hoangDao) { s += 2; tot.push('Hoàng đạo (' + info.than + ')'); } else { s -= 2; xau.push('Hắc đạo (' + info.than + ')'); }
    const tv = TRUC_VIEC[viec];
    if (tv.tot.includes(info.truc)) { s += 1; tot.push('Trực ' + info.truc); }
    if (tv.xau.includes(info.truc)) { s -= 2; xau.push('Trực ' + info.truc); }
    if (info.tamNuong) { s -= 3; cam = true; xau.push('Tam Nương'); }
    if (info.nguyetKy) { s -= 2; xau.push('Nguyệt Kỵ'); }
    if (viec === 'tang') {
      const lm = info.lunar.month - 1, can = CAN[info.canNgay];
      if (TRUNG_TANG[lm] === can) { s -= 5; cam = true; xau.push('Trùng Tang'); }
      if (TRUNG_PHUC[lm] === can) { s -= 5; cam = true; xau.push('Trùng Phục'); }
    }
    people.forEach(p => {
      if (isXung(info.chiNgay, p.chi)) {
        if (canKhac(info.canNgay, p.can)) { s -= 5; cam = true; xau.push('Thiên khắc địa xung tuổi ' + p.label); }
        else { s -= 3; cam = true; xau.push('Xung tuổi ' + p.label); }
      } else if (mod(info.chiNgay + p.chi, 12) === 1 || (info.chiNgay !== p.chi && info.chiNgay % 4 === p.chi % 4)) {
        s += 1; tot.push('Hợp tuổi ' + p.label);
      }
    });
    const gio = info.gio.filter(g => g.tot && !people.some(p => isXung(g.chi, p.chi)));
    const muc = cam ? 'tranh' : s >= 3 ? 'tot' : s >= 1 ? 'kha' : 'xau';
    return { s, muc, tot, xau, gio };
  }
  function findDays(startStr, nDays, viec, people, tz) {
    const [y, m, d] = startStr.split('-').map(Number);
    const jd0 = jdFromDate(d, m, y), out = [];
    for (let i = 0; i < nDays; i++) {
      const [dd, mm, yy] = jdToDate(jd0 + i);
      const info = dayInfo(dd, mm, yy, tz);
      out.push(Object.assign(info, { danh: scoreDay(info, viec, people) }));
    }
    return out;
  }

  const API = { CAN, CHI, CON_GIAP, HANH, CHI_HANH, GIO, HUONG, SAO, jdFromDate, jdToDate, solarToLunar, yearCan, yearChi, canChi, napAm, nguHanhRel, chiRel, isXung, canKhac, cungPhi, person, personFromLunarYear, tuoiMu, kimLau, hoangOc, tamTai, dayInfo, scoreDay, findDays, hourCan, monthCan, monthChi, dayCan, dayChi };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.PT = API;
})(typeof window !== 'undefined' ? window : globalThis);
