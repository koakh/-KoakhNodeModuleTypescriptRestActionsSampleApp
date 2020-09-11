export interface ElapsedTime {
  hours: number;
  minutes: number;
  seconds: number;
  ms: number;
}

/**
 * formatDate
 */
export const formatDate = (date: Date, fullDate = false): string => {
  const yy: string = date.getUTCFullYear().toString();
  const mo: string = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const dd: string = date.getUTCDate().toString().padStart(2, '0');
  const hh: string = date.getUTCHours().toString().padStart(2, '0');
  const mm: string = date.getUTCMinutes().toString().padStart(2, '0');
  const ss: string = date.getUTCSeconds().toString().padStart(2, '0');
  return (fullDate)
    ? `${yy}-${mo}-${dd} ${hh}:${mm}:${ss}`
    : `${hh}:${mm}:${ss}`;
};

export const calcElapsedTime = (start: Date, end: Date): ElapsedTime => {
  const elapsedMs: number = (end.getTime() - start.getTime());
  const elapsed = new Date(elapsedMs);
  // subtract the timezone offset, else we have 1h and not 0h
  elapsed.setTime(elapsed.getTime() + elapsed.getTimezoneOffset() * 60 * 1000);
  const elapsedHours = elapsed.getHours();
  const elapsedMinutes = elapsed.getMinutes();
  const elapsedSeconds = elapsed.getSeconds();

  return { hours: elapsedHours, minutes: elapsedMinutes, seconds: elapsedSeconds, ms: elapsedMs };
};

/**
 * generic function to get Enum key from a Enum value
 * @param enumType a typescript Type
 * @param enumValue string value
 */
export const getEnumKeyFromEnumValue = (enumType: any, enumValue: string | number): any => {
  const keys: string[] = Object.keys(enumType).filter((x) => enumType[x] === enumValue);
  if (keys.length > 0) {
    return keys[0];
  } else {
    // throw error to caller function
    // throw new Error(`Invalid enum value '${enumValue}'! Valid enum values are ${Object.keys(myEnum)}`);
    throw new Error(`Invalid enum value '${enumValue}'! Valid enum value(s() are ${Object.values(enumType)}`);
  }
};

/**
 * generic function to get Enum value from a Enum key
 * @param enumType a typescript Type
 * @param enumValue string value
 */
export const getEnumValueFromEnumKey = (enumType: any, enumKey: string | number): any => {
  // use getEnumKeyByEnumValue to get key from value
  const keys = Object.keys(enumType).filter((x) => getEnumKeyFromEnumValue(enumType, enumType[x]) === enumKey);
  if (keys.length > 0) {
    // return value from equality key
    return enumType[keys[0]];
  } else {
    // throw error to caller function
    throw new Error(`Invalid enum key '${enumKey}'! Valid enum key(s() are ${Object.keys(enumType)}`);
  }
};

/**
 * a test promiseAll function
 * call with: const res = await testPromiseAll();
 */
export const testPromiseAll = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const promise1 = Promise.resolve(3);
      const promise2 = 42;
      // simulate 1000 operation
      const promise3 = new Promise((innerResolve) => {
        setTimeout(innerResolve, 1000, 'foo');
      });

      const promiseArray: any[] = [promise1, promise2];
      // use one push too
      promiseArray.push(promise3);

      Promise.all(promiseArray).then((result) => {
        console.log(result);
        resolve(result);
      });
      // expected output: Array [3, 42, "foo"]
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * a test promiseAll function
 * call with: const res = await testPromiseAll();
 */
export const promiseAll = (promiseArray: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      Promise.all(promiseArray)
        .then((result) => {
          console.log(result);
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// A simple promise that resolves after a given time
export const timeOut = (t: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Completed in ${t}`);
    }, t);
  });
};

/**
 * helper to convert string environment variable to boolean
 */
export const isTrue = (value: string): boolean => {
  return (value.toString().toLowerCase() === 'false' || !value || value === '0')
    ? false
    : true;
};
