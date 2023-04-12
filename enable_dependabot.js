const github = require('@actions/github')

const ghToken = process.env.GITHUB_AUTH_TOKEN
const dst_org = process.env.DST_GITHUB_ORG
const octokit = github.getOctokit(ghToken)


const main = async () => {

  try {
 
    return [];
  } catch (err) {
    console.log(`error: ${err}`);
  }
}

main()
