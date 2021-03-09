const getBandInfo = (songNumber, country, demonym, subgenre, profile) => {
    const clearDate = (rDate) => {
      const date = rDate.toString();
      // Just year
      if (date.length === 4) {
        return date;
      } else if (date.match(',')) {
          const start = date.match(' ');
          const end = date.match(',');
          const suffix = date.substring(end.index - 2, end.index)
          // search only in the second half to avoid removing chars from Month names
          const removeSuffix = date.substring(start.index).replace(suffix, '');
          return `${date.substring(0, start.index)} ${removeSuffix}`;
        } else {
          return date;
        }
    };
    const info = {
        'Band': document.querySelector(".band_name").innerText,
        'Song': document.querySelectorAll('.wrapWords')[(songNumber - 1)].innerText,
        'Album': document.querySelector(".album_name a").innerText,
        'Released': clearDate(document.querySelector("#album_info > .float_left > dd:nth-child(4)").innerText),
        'Label': document.querySelector("#album_info > .float_right > dd:nth-child(2)").innerText,
        'Country': country,
        'Subgenre': subgenre,
    }
  // Reduce will iterate over all the array items and returns a single value.
  const listItems = Object.entries(info).reduce((result, item) => {
    // Add a string to the result for the current item. This syntax is using template literals.
    result += `<li>${item[0]}: ${item[1]}</li>`;
    // Always return the result in the reduce callback, it will be the value or result in the next iteration.
    return result;
  }, ''); // The '' is an empty string, it is the initial value result.
  // Get the element from the DOM in which to display the list, this should be an ul or ol element.
  resultElement = document.getElementById('message');
  // Set the inner HTML
  resultElement.innerHTML = listItems;
  // Add Line up section
  const losotro = Array.from(document.querySelectorAll("#album_members_lineup .ui-tabs-panel-content .lineupRow"))
  if (losotro.length > 0) {
    const elarray = losotro.map(
      member => {
        const elnombre = member.firstElementChild.firstElementChild.innerText;
        const lasCosasQueHace = member.lastElementChild.innerText;
        return `<li>${elnombre}: ${lasCosasQueHace}</li>`;
      }
    )
    resultElement.insertAdjacentHTML("beforeend", "Line up:");
    resultElement.insertAdjacentHTML("beforeend", elarray.join(""));
  }
  const taggify = (words) => {
    // Split each string into separated words to
    // clean unwanted characters and then join all
    // again into a single string
    const cleanString = words.split(" ").map( n => {
      let str = n;
      if (str.includes("'")) {
        str = str.replace(/\'/g, "");
      }
      if (str.includes(".")) {
        str = str.replace(/\./g, "");
      }
      if (str.includes(",")) {
        str = str.replace(/\,/g, "");
      }
      if (str.includes("-")) {
        str = str.replace(/\-/g, "");
      }
      if (str.includes(":")) {
        str = str.replace(/\:/g, "");
      }
        return str;
      }).join("").toLowerCase();
      return `#${cleanString}`;
  }
  // Tag cloud creation
  const createTags = (bandMembers) => {
    let allTags = [
      "#blackmetal",
      taggify(info.Song),
      taggify(info.Band),
      `${taggify(info.Band)}band`,
      `${taggify(info.Band)}blackmetal`,
      `${taggify(info.Band)}bm`,
      info.Song === info.Album ? '' : taggify(info.Album),
      taggify(info.Label)
    ];
    if (bandMembers.length > 0) {
      const names = bandMembers.map(
        member => {
          const fullName = member.firstElementChild.firstElementChild.innerText;
          allTags.push(taggify(fullName));
        }
      );
    }
    allTags.push(taggify(`${demonym}blackmetal`), taggify(`${demonym}metal`));
    allTags.push(taggify(subgenre))
    allTags.push(taggify("blackmetaldaily"))
    return allTags.join(" ");
  }
  if (profile.length > 0) {
    resultElement.insertAdjacentHTML("beforeend", `<p>${profile}</p>`);
  }
  resultElement.insertAdjacentHTML("beforeend", `<p>HH</p>`);
  resultElement.insertAdjacentHTML("beforeend", createTags(losotro));
}
getBandInfo(1, 'Country', 'demonym', 'subgenre', '@instagram-id');