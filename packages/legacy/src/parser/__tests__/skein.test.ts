import {expect, test} from 'bun:test';

import skein from '../skein';

/**
 * Helper tagged template literal function to remove all whitespace from
 * a string, to make the tests more readable.
 */
function squish(input: TemplateStringsArray, ...interpolations: string[]) {
  if (interpolations.length) {
    throw new Error(
      'squish(): Expected a template literal without interpolation',
    );
  }

  return input[0].replace(/\s+/g, '');
}

test('hashing the empty string', () => {
  expect(skein('')).toBe(squish`
    bc5b4c50925519c290cc634277ae3d6257212395cba733bbad37a4af0fa06af4
    1fca7903d06564fea7a2d3730dbdb80c1f85562dfcc070334ea4d1d9e72cba7a
  `);
});

test('hashing the test values from the v1.3 specfication document', () => {
  expect(skein([0xff])).toBe(squish`
    71b7bce6fe6452227b9ced6014249e5bf9a9754c3ad618ccc4e0aae16b316cc8
    ca698d864307ed3e80b6ef1570812ac5272dc409b5a012df2a579102f340617a
  `);

  expect(
    skein(
      // dprint-ignore
      [
        0xff, 0xfe, 0xfd, 0xfc, 0xfb, 0xfa, 0xf9, 0xf8, 0xf7, 0xf6,
        0xf5, 0xf4, 0xf3, 0xf2, 0xf1, 0xf0, 0xef, 0xee, 0xed, 0xec,
        0xeb, 0xea, 0xe9, 0xe8, 0xe7, 0xe6, 0xe5, 0xe4, 0xe3, 0xe2,
        0xe1, 0xe0, 0xdf, 0xde, 0xdd, 0xdc, 0xdb, 0xda, 0xd9, 0xd8,
        0xd7, 0xd6, 0xd5, 0xd4, 0xd3, 0xd2, 0xd1, 0xd0, 0xcf, 0xce,
        0xcd, 0xcc, 0xcb, 0xca, 0xc9, 0xc8, 0xc7, 0xc6, 0xc5, 0xc4,
        0xc3, 0xc2, 0xc1, 0xc0,
      ],
    ),
  ).toBe(
    squish`
      45863ba3be0c4dfc27e75d358496f4ac9a736a505d9313b42b2f5eada79fc17f
      63861e947afb1d056aa199575ad3f8c9a3cc1780b5e5fa4cae050e989876625b
    `,
  );

  expect(
    skein(
      // dprint-ignore
      [
        0xff, 0xfe, 0xfd, 0xfc, 0xfb, 0xfa, 0xf9, 0xf8, 0xf7, 0xf6, 0xf5,
        0xf4, 0xf3, 0xf2, 0xf1, 0xf0, 0xef, 0xee, 0xed, 0xec, 0xeb, 0xea,
        0xe9, 0xe8, 0xe7, 0xe6, 0xe5, 0xe4, 0xe3, 0xe2, 0xe1, 0xe0, 0xdf,
        0xde, 0xdd, 0xdc, 0xdb, 0xda, 0xd9, 0xd8, 0xd7, 0xd6, 0xd5, 0xd4,
        0xd3, 0xd2, 0xd1, 0xd0, 0xcf, 0xce, 0xcd, 0xcc, 0xcb, 0xca, 0xc9,
        0xc8, 0xc7, 0xc6, 0xc5, 0xc4, 0xc3, 0xc2, 0xc1, 0xc0, 0xbf, 0xbe,
        0xbd, 0xbc, 0xbb, 0xba, 0xb9, 0xb8, 0xb7, 0xb6, 0xb5, 0xb4, 0xb3,
        0xb2, 0xb1, 0xb0, 0xaf, 0xae, 0xad, 0xac, 0xab, 0xaa, 0xa9, 0xa8,
        0xa7, 0xa6, 0xa5, 0xa4, 0xa3, 0xa2, 0xa1, 0xa0, 0x9f, 0x9e, 0x9d,
        0x9c, 0x9b, 0x9a, 0x99, 0x98, 0x97, 0x96, 0x95, 0x94, 0x93, 0x92,
        0x91, 0x90, 0x8f, 0x8e, 0x8d, 0x8c, 0x8b, 0x8a, 0x89, 0x88, 0x87,
        0x86, 0x85, 0x84, 0x83, 0x82, 0x81, 0x80,
      ],
    ),
  ).toBe(
    squish`
      91cca510c263c4ddd010530a33073309628631f308747e1bcbaa90e451cab92e
      5188087af4188773a332303e6667a7a210856f742139000071f48e8ba2a5adb7
    `,
  );
});

test('small differences in input lead to large differences in output', () => {
  expect(skein('The quick brown fox jumps over the lazy dog')).toBe(squish`
    94c2ae036dba8783d0b3f7d6cc111ff810702f5c77707999be7e1c9486ff238a
    7044de734293147359b4ac7e1d09cd247c351d69826b78dcddd951f0ef912713
  `);

  expect(skein('The quick brown fox jumps over the lazy dog.')).toBe(squish`
    658223cb3d69b5e76e3588ca63feffba0dc2ead38a95d0650564f2a39da8e83f
    bb42c9d6ad9e03fbfde8a25a880357d457dbd6f74cbcb5e728979577dbce5436
  `);
});
