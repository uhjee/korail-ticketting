import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // 연결 테스트
      await this.transporter.verify();
      console.log('이메일 서비스가 준비되었습니다.');
    } catch (error) {
      console.error('이메일 서비스 초기화 실패:', error);
      throw error;
    }
  }

  async sendEmail(to: string | string[], subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: '"Korail Ticket Bot" <bot@example.com>',
        to,
        subject,
        html,
      });

      console.log('메일이 전송되었습니다.');
      console.log('미리보기 URL:', nodemailer.getTestMessageUrl(info));

      return info;
    } catch (error) {
      console.error('메일 전송 실패:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const emailService = new EmailService();
