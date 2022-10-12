const getBandInfo = (songNumber, country, demonym, subgenre, profile) => {

  // To match the same format as Bandcamp
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

  // Build an object with keys and values
  const info = {
      'Band': document.querySelector(".band_name").innerText,
      'Song': document.querySelectorAll('.wrapWords')[(songNumber - 1)].innerText,
      'Type': document.querySelector("#album_info > dl.float_left > dd:nth-child(2)").innerText,
      'Name': document.querySelector(".album_name a").innerText,
      'Released': clearDate(document.querySelector("#album_info > .float_left > dd:nth-child(4)").innerText),
      'Label': document.querySelector("#album_info > .float_right > dd:nth-child(2)").innerText,
      'Country': country,
      'Subgenre': subgenre,
  }

  // Reduce will iterate over all the array items and returns a single value.
  const listItems = Object.entries(info).reduce((result, item) => {
    result += (item[1] && `<li>${item[0]}: ${item[1]}</li>`);
    return result;
  }, '');
  // Get the element from the DOM in which to display the list
  resultElement = document.getElementById('message');
  // Set the inner HTML
  resultElement.innerHTML = listItems;

  // Line up section
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

  // Creating tags format
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
      info.Song === info.Name ? '' : taggify(info.Name),
      info.Label === "Independent" ? '#independentrelease' : taggify(info.Label)
    ];
    if (bandMembers.length > 0) {
      const names = bandMembers.map(
        member => {
          const fullName = member.firstElementChild.firstElementChild.innerText;
          allTags.push(taggify(fullName));
        }
      );
    }
    allTags.push(taggify(`${demonym}blackmetal`), taggify(`${demonym}metal`), taggify(`${demonym}metalband`), taggify(`${demonym}bm`) );
    if (subgenre) {
      allTags.push(taggify(subgenre))
    }
    allTags.push(taggify("blackmetalalbum"))
    allTags.push(taggify("blackmetalband"))
    allTags.push(taggify("blackmetaldaily"))
    return allTags.join(" ");
  }

  // If it is available, add Instagram mention
  if (profile.length > 0) {
    resultElement.insertAdjacentHTML("beforeend", `<p>@${profile}</p>`);
  }

  resultElement.insertAdjacentHTML("beforeend", `<p></p>`);
  resultElement.insertAdjacentHTML("beforeend", createTags(losotro));
}

getBandInfo(6, 'Norway', 'Norwegian', 'Depressive Black Metal', '');