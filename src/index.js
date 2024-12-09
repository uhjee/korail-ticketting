"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var selenium_webdriver_1 = require("selenium-webdriver");
var chrome_1 = require("selenium-webdriver/chrome");
var KorailTicketing = /** @class */ (function () {
    function KorailTicketing() {
        this.URL = 'https://www.letskorail.com/ebizprd/EbizPrdTicketpr21100W_pr21110.do';
        // 크롬 드라이버 설정
        var options = new chrome_1.Options();
        // options.addArguments('--headless'); // 헤드리스 모드 (필요시 주석 해제)
        this.driver = new selenium_webdriver_1.Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    }
    /**
     * 기차 조회 페이지를 초기화하고 검색 조건을 설정합니다
     */
    KorailTicketing.prototype.initializeSearch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var adultSelect, ktxRadio, directRadio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.driver.get(this.URL)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.driver.findElement(selenium_webdriver_1.By.name('txtPsgFlg_1'))];
                    case 2:
                        adultSelect = _a.sent();
                        return [4 /*yield*/, this.driver.executeScript("arguments[0].value = '2'; arguments[0].dispatchEvent(new Event('change'))", adultSelect)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.driver.findElement(selenium_webdriver_1.By.id('selGoTrainRa00'))];
                    case 4:
                        ktxRadio = _a.sent();
                        return [4 /*yield*/, this.driver.executeScript("arguments[0].click(); arguments[0].dispatchEvent(new Event('change'))", ktxRadio)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.driver.findElement(selenium_webdriver_1.By.id('route01'))];
                    case 6:
                        directRadio = _a.sent();
                        return [4 /*yield*/, this.driver.executeScript("arguments[0].click(); arguments[0].dispatchEvent(new Event('change'))", directRadio)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 출발역과 도착역을 설정합니다
     */
    KorailTicketing.prototype.setStations = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // 출발역 설정
                    return [4 /*yield*/, this.setStation('start', '서울')];
                    case 1:
                        // 출발역 설정
                        _a.sent();
                        // 도착역 설정
                        return [4 /*yield*/, this.setStation('end', '부산')];
                    case 2:
                        // 도착역 설정
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 특정 역을 선택합니다
     */
    KorailTicketing.prototype.setStation = function (type, stationName) {
        return __awaiter(this, void 0, void 0, function () {
            var inputId, stationInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputId = type === 'start' ? 'start' : 'get';
                        return [4 /*yield*/, this.driver.findElement(selenium_webdriver_1.By.id(inputId))];
                    case 1:
                        stationInput = _a.sent();
                        return [4 /*yield*/, this.driver.executeScript("\n      arguments[0].value = arguments[1];\n      arguments[0].dispatchEvent(new Event('change'));\n      ", stationInput, stationName)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 날짜와 시간을 설정합니다
     * @param date 설정할 날짜와 시간
     */
    KorailTicketing.prototype.setDateTime = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            var dateTimeSettings, _i, dateTimeSettings_1, setting, element;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dateTimeSettings = [
                            { id: 's_year', value: date.getFullYear().toString() },
                            {
                                id: 's_month',
                                value: (date.getMonth() + 1).toString().padStart(2, '0'),
                            },
                            { id: 's_day', value: date.getDate().toString().padStart(2, '0') },
                            { id: 's_hour', value: date.getHours().toString().padStart(2, '0') },
                        ];
                        _i = 0, dateTimeSettings_1 = dateTimeSettings;
                        _a.label = 1;
                    case 1:
                        if (!(_i < dateTimeSettings_1.length)) return [3 /*break*/, 5];
                        setting = dateTimeSettings_1[_i];
                        return [4 /*yield*/, this.driver.findElement(selenium_webdriver_1.By.id(setting.id))];
                    case 2:
                        element = _a.sent();
                        return [4 /*yield*/, this.driver.executeScript("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('change'))", element, setting.value)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 조회 결과를 파싱하여 예매 가능한 열차 정보를 반환합니다
     */
    KorailTicketing.prototype.parseResults = function () {
        return __awaiter(this, void 0, void 0, function () {
            var availableTrains, page, rows, _i, rows_1, row, departureTime, arrivalTime, firstClassImg, economyClassImg, firstClassStatus, economyClassStatus, unavailableStatuses, error_1, nextButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        availableTrains = [];
                        page = 1;
                        _a.label = 1;
                    case 1:
                        if (!(page <= 3)) return [3 /*break*/, 19];
                        // 테이블이 로드될 때까지 대기
                        return [4 /*yield*/, this.driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.id('tableResult')), 10000)];
                    case 2:
                        // 테이블이 로드될 때까지 대기
                        _a.sent();
                        return [4 /*yield*/, this.driver.findElements(selenium_webdriver_1.By.css('#tableResult tr'))];
                    case 3:
                        rows = _a.sent();
                        _i = 0, rows_1 = rows;
                        _a.label = 4;
                    case 4:
                        if (!(_i < rows_1.length)) return [3 /*break*/, 14];
                        row = rows_1[_i];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 12, , 13]);
                        return [4 /*yield*/, row
                                .findElement(selenium_webdriver_1.By.css('td:nth-child(4)'))
                                .getText()];
                    case 6:
                        departureTime = _a.sent();
                        return [4 /*yield*/, row
                                .findElement(selenium_webdriver_1.By.css('td:nth-child(5)'))
                                .getText()];
                    case 7:
                        arrivalTime = _a.sent();
                        return [4 /*yield*/, row.findElement(selenium_webdriver_1.By.css('td:nth-child(6) img'))];
                    case 8:
                        firstClassImg = _a.sent();
                        return [4 /*yield*/, row.findElement(selenium_webdriver_1.By.css('td:nth-child(7) img'))];
                    case 9:
                        economyClassImg = _a.sent();
                        return [4 /*yield*/, firstClassImg.getAttribute('alt')];
                    case 10:
                        firstClassStatus = _a.sent();
                        return [4 /*yield*/, economyClassImg.getAttribute('alt')];
                    case 11:
                        economyClassStatus = _a.sent();
                        unavailableStatuses = [
                            '좌석매진',
                            '요구하신 좌석보다 남아 있는 좌석이 부족합니다',
                        ];
                        if (!unavailableStatuses.includes(firstClassStatus) ||
                            !unavailableStatuses.includes(economyClassStatus)) {
                            availableTrains.push([
                                departureTime,
                                arrivalTime,
                                firstClassStatus,
                                economyClassStatus,
                            ]);
                        }
                        return [3 /*break*/, 13];
                    case 12:
                        error_1 = _a.sent();
                        return [3 /*break*/, 13]; // 유효하지 않은 행은 건너뜀
                    case 13:
                        _i++;
                        return [3 /*break*/, 4];
                    case 14:
                        if (!(page < 3)) return [3 /*break*/, 18];
                        return [4 /*yield*/, this.driver.findElement(selenium_webdriver_1.By.css('img[alt="다음"]'))];
                    case 15:
                        nextButton = _a.sent();
                        return [4 /*yield*/, nextButton.click()];
                    case 16:
                        _a.sent();
                        // 페이지 전환 대기
                        return [4 /*yield*/, this.driver.sleep(1000)];
                    case 17:
                        // 페이지 전환 대기
                        _a.sent();
                        _a.label = 18;
                    case 18:
                        page++;
                        return [3 /*break*/, 1];
                    case 19: return [2 /*return*/, availableTrains];
                }
            });
        });
    };
    /**
     * 티켓팅 프로세스를 실행합니다
     */
    KorailTicketing.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var searchButton, availableTrains, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, 8, 10]);
                        return [4 /*yield*/, this.initializeSearch()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.setStations()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.setDateTime(new Date('2024-12-14 08:00:00'))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.driver.findElement(selenium_webdriver_1.By.css('#center > div.ticket_box > p.btn_inq'))];
                    case 4:
                        searchButton = _a.sent();
                        return [4 /*yield*/, this.driver.executeScript("arguments[0].click(); arguments[0].dispatchEvent(new Event('change'))", searchButton)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.parseResults()];
                    case 6:
                        availableTrains = _a.sent();
                        // 결과 출력
                        console.log('예매 가능한 열차:');
                        availableTrains.forEach(function (train) {
                            console.log(train);
                        });
                        return [3 /*break*/, 10];
                    case 7:
                        error_2 = _a.sent();
                        console.error('에러 발생:', error_2);
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, this.driver.quit()];
                    case 9:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return KorailTicketing;
}());
// 프로그램 실행
var ticketing = new KorailTicketing();
ticketing.run();
