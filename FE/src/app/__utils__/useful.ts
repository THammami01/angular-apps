import { Incident } from './../__models__/Incident.model';

export const flattenObject = (obj: Incident, includeOnly: string[]) => {
  return Object.entries(obj)
    .map((el) => {
      if (includeOnly.length !== 0 && !includeOnly.includes(el[0])) return '';
      if (el[0] === 'voltage') return String(el[1]) + ' KV';
      if (el[0] === 'cutOff' || el[0] === 'recovery')
        return String(el[1]) + ' A';
      return String(el[1]);
    })
    .join(' ');
};

export const changeMySQLDate = (date: string) => {
  return date?.split('T')[0].split('-').reverse().join('/');
};

export const getMonday = (date: Date) => {
  const day = date.getDay(),
    diff = date.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

export const dynamicSort = (property: any) => {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return (a: any, b: any) => {
    let result =
      a[property] > b[property] ? -1 : a[property] < b[property] ? 1 : 0;
    return result * sortOrder;
  };
};

export const getCurrentDatetime = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const hh = String(today.getHours()).padStart(2, '0');
  const MM = String(today.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${MM}`;
};
