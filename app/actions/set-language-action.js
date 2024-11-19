'use server';

import { cookies } from 'next/headers';

export default async function setLanguageValue(value) {
  cookies().set('language', value);
}
