"use strict";

const fs = require('node:fs');

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  // Toggle to turn on or off debug `console.wanr()` calls
  // console.warn = () => {};

  let firstLogEntries = [];

  const binarySearch = (datedEntries, datedEntryToSearch) => {
    let resultIndex = 0;
    let prevMiddleIndex = 0;
    let middleIndex = Math.floor(datedEntries.length / 2);

    const complete = (completeIndex) => {
      resultIndex = completeIndex;
      middleIndex = false;

      console.warn(`

      binarySearch COMPLETE
        resultIndex: `, resultIndex, `

      `)

      return resultIndex;
    }

    let whileIterCounter = 0;
    console.warn(`

    binarySearch START
      datedEntryToSearch: `, datedEntryToSearch, `
      datedEntries.length: `, datedEntries.length, `
      middleIndex: `, middleIndex, `

    `)

    while (middleIndex !== false && datedEntries.length) {
      whileIterCounter++;
      const entryDate = datedEntryToSearch.date;
      const middleDate = datedEntries?.[middleIndex]?.date;
      const middlePrevDate = datedEntries?.[middleIndex - 1]?.date;
      const middleSecondPrevDate = datedEntries?.[middleIndex - 2]?.date;
      const middleNextDate = datedEntries?.[middleIndex + 1]?.date;
      const diff = Math.abs(middleIndex - prevMiddleIndex);
      let newMiddleIndex;

      console.warn(`

      binarySearch WHILE iteration: `, whileIterCounter, `
        entryDate: `, entryDate, `
        middleSecondPrevDate: `, middleSecondPrevDate, `
        middlePrevDate: `, middlePrevDate, `
        middleDate: `, middleDate, `
        middleNextDate: `, middleNextDate, `
        diff: `, diff, `
        prevMiddleIndex: `, prevMiddleIndex, `
        middleIndex: `, middleIndex, `

      `)

      if (entryDate === middleDate) {
        console.warn(`

        binarySearch WHILE entryDate === middleDate

        `)
        return complete(middleIndex);
      } else if (diff === 0) {

        console.warn(`

        binarySearch WHILE diff < 2

        `)

        if (middleSecondPrevDate && entryDate <= middleSecondPrevDate) {
          return complete(middleIndex - 2);
        }
        if (middlePrevDate && entryDate <= middlePrevDate) {
          return complete(middleIndex - 1);
        }
        if (middleNextDate && entryDate >= middleNextDate) {
          return complete(middleIndex + 2);
        }
        if (middleDate && entryDate > middleDate) {
          return complete(middleIndex + 1);
        }
        return complete(middleIndex);
      } else {
        console.warn(`

        binarySearch WHILE else

        `)
        if (entryDate > middleDate) {
          newMiddleIndex = middleIndex + Math.floor(diff / 2);

          console.warn(`

          binarySearch WHILE entryDate > middleDate
            newMiddleIndex: `, newMiddleIndex, `

          `)

          // if (newMiddleIndex >= datedEntries.length) {
          //   console.warn(`

          //   binarySearch WHILE newMiddleIndex >= datedEntries.length - 1

          //   `)
          //   complete(datedEntries.length);
          // }
        } else {
          newMiddleIndex = middleIndex - Math.floor(diff / 2);

          console.warn(`

          binarySearch WHILE entryDate < middleDate
            newMiddleIndex: `, newMiddleIndex, `

          `)

          if (newMiddleIndex < 0) {
            console.warn(`

            binarySearch WHILE newMiddleIndex <= 0

            `)
            return complete(0);
          }
        }
      }

      if (middleIndex !== false) {
        resultIndex = middleIndex;
        prevMiddleIndex = middleIndex;
        middleIndex = newMiddleIndex;
      }
    }

    console.warn(`

    binarySearch POST
      prevMiddleIndex: `,prevMiddleIndex, `
      middleIndex: `, middleIndex, `
      resultIndex: `,resultIndex, `

    `)

    return resultIndex;
  };

  const popNextLogSource = (i) => {
    const firstLogEntry = logSources[i].pop();

    console.warn(`

      popNextLogSource
      firstLogEntry: `, firstLogEntry, `

    `)

    if (firstLogEntry) {
      const firstLogEntriesIndex = binarySearch(firstLogEntries, firstLogEntry);

      console.warn(`

      popNextLogSource has firstLogEntry
        firstLogEntriesIndex: `, firstLogEntriesIndex, `
        firstLogEntry: `, firstLogEntry, `
        firstLogEntries.length: `, firstLogEntries.length, `

      `)
      if (firstLogEntriesIndex !== false) {
        firstLogEntries = [
          ...firstLogEntries.slice(0, firstLogEntriesIndex),
          {
            logSourcesIndex: i,
            ...firstLogEntry,
          },
          //...firstLogEntries.slice(firstLogEntriesIndex + (removeExisting ? 1 : 0)),
          ...firstLogEntries.slice(firstLogEntriesIndex),
        ];
      }
    }
  }

  for (let i = 0; i < logSources.length; i++) {
    console.warn(i)
    console.warn(firstLogEntries)
    popNextLogSource(i);
  }

  console.warn(`

    \n\n\n\n MAIN LOOP \n\n\n\n
    firstLogEntries: `, firstLogEntries, `

    `)

  while (firstLogEntries.length) {
    const currLogEntry = firstLogEntries.shift();
    printer.print(currLogEntry);
    popNextLogSource(currLogEntry.logSourcesIndex);

    console.warn(`

      \nfirstLogEntries NOW!!!\n
      firstLogEntries.length: `, firstLogEntries.length, `\n
      firstLogEntries: `, firstLogEntries, `

    `)
  }

  printer.done();

  return console.log("Sync sort complete.");
};
