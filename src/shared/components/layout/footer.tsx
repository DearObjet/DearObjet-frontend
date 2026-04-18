import { Link } from 'react-router';
import { type MouseEvent } from 'react';
import { ChevronRight } from 'lucide-react';

import { INFO_LINKS, PARTNER_LINKS } from '../../constants';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleComingSoon =
    (content: string = '') =>
    (e: MouseEvent) => {
      const EXCEPTION = '공지사항';
      if (content === EXCEPTION) return;

      e.preventDefault();

      return alert(
        content
          ? `준비중인 서비스입니다. (${content})`
          : '준비중인 서비스입니다.'
      );
    };

  return (
    <footer className="w-full bg-theme-300">
      <div className="mx-auto max-w-[120rem] px-[19.469rem] py-10">
        <div className="flex gap-16">
          {/* 고객센터 */}
          <section
            aria-labelledby="footer-cs-title"
            className="w-[13.5rem] shrink-0"
          >
            <h2 id="footer-cs-title" className="mb-3 font-bold">
              <Link
                to="/help"
                className="inline-flex items-center text-theme-900 transition-colors duration-150 hover:text-theme-700"
              >
                고객센터
                <span aria-hidden="true">
                  <ChevronRight />
                </span>
              </Link>
            </h2>

            <p className="mb-2 text-sm text-theme-900">
              <strong className="font-bold">0000&#45;0000</strong>
              <span className="ml-1.5 text-xs">09&#58;00 &#126; 18&#58;00</span>
            </p>

            <ul
              className="mb-4 flex flex-col gap-1 text-xs text-theme-900"
              role="list"
            >
              <li>&#45; 평일&#58; 전체 문의 상담</li>
              <li>&#45; 주말&#44; 공휴일&#58; 휴무</li>
            </ul>

            <div className="flex flex-col gap-2">
              <a
                href="https://pf.kakao.com/_dearobjet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded border border-theme-700 px-3 py-1.5 text-xs text-theme-900 transition-colors duration-150 hover:text-theme-700"
                onClick={handleComingSoon()}
              >
                카카오 상담 &#40; 평일 09&#58;00 &#126; 18&#58;00 &#41;
              </a>
              <a
                href="mailto:support@dearobjet.com"
                className="inline-flex items-center justify-center rounded border border-theme-700 px-3 py-1.5 text-xs text-theme-900 transition-colors duration-150 hover:text-theme-700"
                onClick={handleComingSoon()}
              >
                이메일 문의
              </a>
            </div>
          </section>

          {/* 링크 */}
          <nav aria-label="사이트 정보 메뉴" className="flex gap-14">
            {/* 회사 관련 */}
            <ul className="flex flex-col gap-3" role="list">
              {INFO_LINKS.map(({ label, to, isBold }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={[
                      'text-sm transition-colors duration-150 hover:text-theme-700',
                      isBold
                        ? 'font-bold text-theme-900'
                        : 'font-medium text-theme-900',
                    ].join(' ')}
                    onClick={handleComingSoon(label)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* 파트너 관련 */}
            <ul className="flex flex-col gap-3" role="list">
              {PARTNER_LINKS.map(({ label, to, isBold }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={[
                      'text-sm transition-colors duration-150 hover:text-theme-700',
                      isBold
                        ? 'font-bold text-theme-900'
                        : 'font-medium text-theme-900',
                    ].join(' ')}
                    onClick={handleComingSoon(label)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 사업자 정보 */}
          <section
            aria-label="사업자 정보"
            className="ml-auto text-xs leading-relaxed text-theme-700"
          >
            <address className="not-italic">
              <p className="mb-1">
                &#40;주&#41;디어오브제 주식회사 &nbsp;&#124;&nbsp; 대표이사
                최재호 &nbsp;&#124;&nbsp; 서울특별시 강남구 테헤란로 000&#44;
                0층
              </p>
              <p className="mb-1">
                <a
                  href="mailto:contact@dearobjet.com"
                  className="hover: text-theme-700 hover:text-theme-700 hover:underline"
                >
                  contact@dearobjet.com
                </a>
                &nbsp;&#124;&nbsp; 사업자등록번호 000&#45;00&#45;00000
              </p>
              <p>통신판매업신고번호 제2024&#45;서울강남&#45;0000호</p>
            </address>

            <p className="mt-3 max-w-[24rem] text-theme-700">
              디어오브제는 통신판매중개자로서 거래 당사자가 아니므로, 작가 및
              소품샵이 등록한 상품 정보 및 거래에 대해 책임을 지지 않습니다.
            </p>
          </section>
        </div>

        {/* 카피라이트 */}
        <div className="mt-5 border-t border-theme-700 pt-4">
          <p className="text-xs text-theme-700">
            Copyright {currentYear}. Dear Objet Co., Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
