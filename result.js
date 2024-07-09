document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('submit').addEventListener('click', async function () {
        const phoneNumber = document.getElementById('phoneNumber').value;

        if (phoneNumber === "") {
            alert("กรุณาใส่เบอร์โทร");
            return;
        }

        document.getElementById('displayArea').innerText = `เบอร์โทรของคุณคือ: ${phoneNumber}`;

        let pairs = new Set(); // ใช้ Set เพื่อเก็บเลขคู่และหลีกเลี่ยงการซ้ำ

        // เริ่มต้นที่เลขที่ 2 และไม่รวมเลขสองตัวแรก
        for (let i = 2; i < phoneNumber.length - 1; i++) {
            const pair = phoneNumber.substring(i, i + 2);
            pairs.add(pair);
        }

        document.getElementById('pairsArea').innerText = `จับคู่เบอร์โทร: ${Array.from(pairs).join(', ')}`;

        const resultsArea = document.getElementById('resultsArea');
        resultsArea.innerHTML = ''; // Clear previous results

        // ใช้ Set เพื่อเก็บคู่ที่ถูกแสดงไปแล้ว
        const displayedPairs = new Set();
        let totalGoodPoints = 0; // ตัวแปรสำหรับเก็บผลรวมของ good points
        let totalBadPoints = 0;  // ตัวแปรสำหรับเก็บผลรวมของ bad points

        for (let pair of pairs) {
            // ตรวจสอบว่าเลขคู่หรือคู่ที่สลับกันมีข้อมูลอยู่หรือไม่
            const response = await fetch(`/api/get-num-data?num_number1=${pair}`);
            const data = await response.json();

            const reversedPair = pair[1] + pair[0];
            const responseReversed = await fetch(`/api/get-num-data?num_number1=${reversedPair}`);
            const reversedData = await responseReversed.json();

            if (data.length > 0 || reversedData.length > 0) {
                if (!displayedPairs.has(pair) && !displayedPairs.has(reversedPair)) {
                    displayedPairs.add(pair);
                    displayedPairs.add(reversedPair);
                    if (data.length > 0) {
                        data.forEach(result => {
                            totalGoodPoints += result.num_good_point; // เพิ่มค่า good point
                            totalBadPoints += result.num_bad_point;   // เพิ่มค่า bad point
                            const div = document.createElement('div');
                            div.innerText = `จับคู่เบอร์: ${pair}, รายละเอียด: ${result.num_detail}`;
                            resultsArea.appendChild(div);
                        });
                    }
                    if (reversedData.length > 0 && data.length == 0) {
                        reversedData.forEach(result => {
                            totalGoodPoints += result.num_good_point; // เพิ่มค่า good point
                            totalBadPoints += result.num_bad_point;   // เพิ่มค่า bad point
                            const div = document.createElement('div');
                            div.innerText = `จับคู่เบอร์: ${reversedPair}, รายละเอียด: ${result.num_detail}`;
                            resultsArea.appendChild(div);
                        });
                    }
                } else {
                    if (data.length > 0) {
                        data.forEach(result => {
                            totalGoodPoints += result.num_good_point; // เพิ่มค่า good point
                            totalBadPoints += result.num_bad_point;   // เพิ่มค่า bad point
                        });
                    }
                    if (reversedData.length > 0) {
                        reversedData.forEach(result => {
                            totalGoodPoints += result.num_good_point; // เพิ่มค่า good point
                            totalBadPoints += result.num_bad_point;   // เพิ่มค่า bad point
                        });
                    }
                }
            }
        }

        // คำนวณผลรวมทั้งหมดและเปอร์เซ็นต์
        const totalGoodPointsPercent = totalGoodPoints / 10;
        const totalBadPointsPercent = totalBadPoints / 10;
        const totalPointsPercent = (parseFloat(totalGoodPointsPercent) + parseFloat(totalBadPointsPercent)).toFixed(2);


        // แสดงผลลัพธ์ของผลรวม good point, bad point และผลรวมทั้งหมดในเปอร์เซ็นต์
        const pointsDiv = document.createElement('div');
        pointsDiv.innerText = `ผลรวมคะแนนบวก: ${totalGoodPointsPercent}%, ผลรวมคะแนนลบ: ${totalBadPointsPercent}%, ผลรวมคะแนนทั้งหมด: ${totalPointsPercent}%`;
        resultsArea.appendChild(pointsDiv);
    });
});









