import { describe, test, expect } from 'vitest';

describe('update-news.js', () => {

  describe('Date Validation', () => {
    test('should validate correct date format YYYY-MM-DD', () => {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

      expect('2025-09-15').toMatch(isoDateRegex);
      expect('2025-01-01').toMatch(isoDateRegex);
      expect('2025-12-31').toMatch(isoDateRegex);
    });

    test('should reject invalid date formats', () => {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

      expect('15/09/2025').not.toMatch(isoDateRegex);
      expect('15-09-2025').not.toMatch(isoDateRegex);
      expect('invalid').not.toMatch(isoDateRegex);
      expect('15.09.2025').not.toMatch(isoDateRegex);
      expect('2025-9-15').not.toMatch(isoDateRegex); // Single digit month
      expect('2025-09-5').not.toMatch(isoDateRegex); // Single digit day
    });

    test('should validate day is within month range', () => {
      const validateDate = (dateStr) => {
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!isoDateRegex.test(dateStr)) return false;

        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);

        if (isNaN(date.getTime())) return false;

        return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
      };

      expect(validateDate('2025-09-15')).toBe(true);
      expect(validateDate('2025-01-31')).toBe(true);
      expect(validateDate('2024-02-29')).toBe(true); // Leap year
      expect(validateDate('2025-02-29')).toBe(false); // Not a leap year
      expect(validateDate('2025-01-32')).toBe(false); // Invalid day
      expect(validateDate('2025-13-15')).toBe(false); // Invalid month
    });
  });

  describe('Date Formatting', () => {
    test('should format dates correctly', () => {
      const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'];

        const suffix = (day) => {
          if (day > 3 && day < 21) return 'th';
          switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
          }
        };

        return `${monthNames[month - 1]} ${day}${suffix(day)}, ${year}`;
      };

      expect(formatDate('2025-09-15')).toBe('September 15th, 2025');
      expect(formatDate('2025-01-01')).toBe('January 1st, 2025');
      expect(formatDate('2025-05-02')).toBe('May 2nd, 2025');
      expect(formatDate('2025-03-03')).toBe('March 3rd, 2025');
      expect(formatDate('2025-12-21')).toBe('December 21st, 2025');
      expect(formatDate('2025-06-22')).toBe('June 22nd, 2025');
      expect(formatDate('2025-07-23')).toBe('July 23rd, 2025');
      expect(formatDate('2025-11-11')).toBe('November 11th, 2025');
    });
  });

  describe('URL Validation', () => {
    test('should validate correct URLs', () => {
      const validateUrl = (url) => {
        try {
          new URL(url);
          return true;
        } catch (e) {
          return false;
        }
      };

      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://example.com')).toBe(true);
      expect(validateUrl('https://example.com/path')).toBe(true);
      expect(validateUrl('https://example.com/path?query=1')).toBe(true);
    });

    test('should reject invalid URLs', () => {
      const validateUrl = (url) => {
        try {
          const urlObj = new URL(url);
          return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch (e) {
          return false;
        }
      };

      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('example.com')).toBe(false);
      expect(validateUrl('')).toBe(false);
      expect(validateUrl('htp://invalid')).toBe(false);
    });
  });

  describe('Data Processing', () => {
    test('should process valid news items', () => {
      const processSheetData = (rows) => {
        const newsItems = [];
        const errors = [];

        const validateDate = (dateStr) => {
          const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!isoDateRegex.test(dateStr)) return false;

          const [year, month, day] = dateStr.split('-').map(Number);
          const date = new Date(year, month - 1, day);

          if (isNaN(date.getTime())) return false;

          return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
        };

        const formatDate = (dateStr) => {
          const [year, month, day] = dateStr.split('-').map(Number);
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
          const suffix = (day) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
              case 1: return 'st';
              case 2: return 'nd';
              case 3: return 'rd';
              default: return 'th';
            }
          };
          return `${monthNames[month - 1]} ${day}${suffix(day)}, ${year}`;
        };

        rows.forEach((row, index) => {
          const rowNumber = index + 2;
          const [dateStr, link, title] = row;

          if (!dateStr || !link || !title) {
            errors.push(`Row ${rowNumber}: Missing fields`);
            return;
          }

          let formattedDate;
          let isOngoing = false;

          if (dateStr.trim().toLowerCase() === 'ongoing') {
            formattedDate = 'Ongoing';
            isOngoing = true;
          } else if (!validateDate(dateStr.trim())) {
            errors.push(`Row ${rowNumber}: Invalid date format`);
            return;
          } else {
            formattedDate = formatDate(dateStr.trim());
          }

          try {
            new URL(link.trim());
          } catch (e) {
            errors.push(`Row ${rowNumber}: Invalid URL`);
            return;
          }

          newsItems.push({
            date: formattedDate,
            title: title.trim(),
            url: link.trim(),
            isOngoing: isOngoing || undefined
          });
        });

        return { newsItems, errors };
      };

      const testRows = [
        ['2025-09-15', 'https://example.com/article1', 'Test Article 1'],
        ['Ongoing', 'https://example.com/article2', 'Test Article 2'],
        ['2025-07-23', 'https://example.com/article3', 'Test Article 3']
      ];

      const { newsItems, errors } = processSheetData(testRows);

      expect(errors).toHaveLength(0);
      expect(newsItems).toHaveLength(3);
      expect(newsItems[0].date).toBe('September 15th, 2025');
      expect(newsItems[1].date).toBe('Ongoing');
      expect(newsItems[1].isOngoing).toBe(true);
      expect(newsItems[2].date).toBe('July 23rd, 2025');
    });

    test('should detect validation errors', () => {
      const processSheetData = (rows) => {
        const newsItems = [];
        const errors = [];

        const validateDate = (dateStr) => {
          const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!isoDateRegex.test(dateStr)) return false;

          const [year, month, day] = dateStr.split('-').map(Number);
          const date = new Date(year, month - 1, day);

          if (isNaN(date.getTime())) return false;

          return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
        };

        rows.forEach((row, index) => {
          const rowNumber = index + 2;
          const [dateStr, link, title] = row;

          if (!dateStr || !link || !title) {
            errors.push(`Row ${rowNumber}: Missing fields`);
            return;
          }

          if (dateStr.trim().toLowerCase() !== 'ongoing' && !validateDate(dateStr.trim())) {
            errors.push(`Row ${rowNumber}: Invalid date format`);
            return;
          }

          try {
            new URL(link.trim());
          } catch (e) {
            errors.push(`Row ${rowNumber}: Invalid URL`);
            return;
          }
        });

        return { newsItems, errors };
      };

      const testRows = [
        ['invalid-date', 'https://example.com', 'Test 1'],
        ['2025-09-15', 'not-a-url', 'Test 2'],
        ['', 'https://example.com', 'Test 3'],
        ['2025-09-15', 'https://example.com', '']
      ];

      const { errors } = processSheetData(testRows);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('Invalid date format'))).toBe(true);
      expect(errors.some(e => e.includes('Invalid URL'))).toBe(true);
      expect(errors.some(e => e.includes('Missing fields'))).toBe(true);
    });
  });

  describe('JSON Output', () => {
    test('should create valid JSON structure', () => {
      const newsItems = [
        { date: 'September 15th, 2025', title: 'Test 1', url: 'https://example.com/1', isOngoing: undefined },
        { date: 'Ongoing', title: 'Test 2', url: 'https://example.com/2', isOngoing: true }
      ];

      const cleanedItems = newsItems.map(item => {
        const cleaned = {
          date: item.date,
          title: item.title,
          url: item.url
        };
        if (item.isOngoing) {
          cleaned.isOngoing = true;
        }
        return cleaned;
      });

      const jsonString = JSON.stringify(cleanedItems, null, 4);
      const parsed = JSON.parse(jsonString);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toHaveProperty('date');
      expect(parsed[0]).toHaveProperty('title');
      expect(parsed[0]).toHaveProperty('url');
      expect(parsed[0]).not.toHaveProperty('isOngoing');
      expect(parsed[1]).toHaveProperty('isOngoing');
      expect(parsed[1].isOngoing).toBe(true);
    });
  });

  describe('Sorting', () => {
    test('should sort with ongoing items first', () => {
      const sortNewsItems = (newsItems) => {
        return newsItems.sort((a, b) => {
          if (a.isOngoing && !b.isOngoing) return -1;
          if (!a.isOngoing && b.isOngoing) return 1;

          if (!a.isOngoing && !b.isOngoing) {
            return b.rawDate.localeCompare(a.rawDate);
          }

          return 0;
        });
      };

      const newsItems = [
        { date: 'January 1st, 2025', title: 'Test 1', url: 'https://example.com/1', isOngoing: undefined, rawDate: '2025-01-01' },
        { date: 'Ongoing', title: 'Test 2', url: 'https://example.com/2', isOngoing: true, rawDate: null },
        { date: 'March 15th, 2025', title: 'Test 3', url: 'https://example.com/3', isOngoing: undefined, rawDate: '2025-03-15' }
      ];

      const sorted = sortNewsItems([...newsItems]);

      expect(sorted[0].isOngoing).toBe(true);
      expect(sorted[0].title).toBe('Test 2');
      expect(sorted[1].date).toBe('March 15th, 2025'); // More recent
      expect(sorted[2].date).toBe('January 1st, 2025'); // Older
    });

    test('should sort by most recent date first', () => {
      const sortNewsItems = (newsItems) => {
        return newsItems.sort((a, b) => {
          if (a.isOngoing && !b.isOngoing) return -1;
          if (!a.isOngoing && b.isOngoing) return 1;

          if (!a.isOngoing && !b.isOngoing) {
            return b.rawDate.localeCompare(a.rawDate);
          }

          return 0;
        });
      };

      const newsItems = [
        { date: 'January 5th, 2025', title: 'Test 1', url: 'https://example.com/1', isOngoing: undefined, rawDate: '2025-01-05' },
        { date: 'December 31st, 2025', title: 'Test 2', url: 'https://example.com/2', isOngoing: undefined, rawDate: '2025-12-31' },
        { date: 'June 15th, 2025', title: 'Test 3', url: 'https://example.com/3', isOngoing: undefined, rawDate: '2025-06-15' }
      ];

      const sorted = sortNewsItems([...newsItems]);

      expect(sorted[0].date).toBe('December 31st, 2025');
      expect(sorted[1].date).toBe('June 15th, 2025');
      expect(sorted[2].date).toBe('January 5th, 2025');
    });

    test('should handle multiple ongoing items', () => {
      const sortNewsItems = (newsItems) => {
        return newsItems.sort((a, b) => {
          if (a.isOngoing && !b.isOngoing) return -1;
          if (!a.isOngoing && b.isOngoing) return 1;

          if (!a.isOngoing && !b.isOngoing) {
            return b.rawDate.localeCompare(a.rawDate);
          }

          return 0;
        });
      };

      const newsItems = [
        { date: 'January 1st, 2025', title: 'Test 1', url: 'https://example.com/1', isOngoing: undefined, rawDate: '2025-01-01' },
        { date: 'Ongoing', title: 'Test 2', url: 'https://example.com/2', isOngoing: true, rawDate: null },
        { date: 'Ongoing', title: 'Test 3', url: 'https://example.com/3', isOngoing: true, rawDate: null },
        { date: 'March 15th, 2025', title: 'Test 4', url: 'https://example.com/4', isOngoing: undefined, rawDate: '2025-03-15' }
      ];

      const sorted = sortNewsItems([...newsItems]);

      expect(sorted[0].isOngoing).toBe(true);
      expect(sorted[1].isOngoing).toBe(true);
      expect(sorted[2].date).toBe('March 15th, 2025');
      expect(sorted[3].date).toBe('January 1st, 2025');
    });
  });
});
