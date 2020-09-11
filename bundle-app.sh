#!/bin/bash

# this file is always called on "make deb" to

NEXE_BIN=nexe
# used inproduction mode
# BUNDLE_PATH="./bin"
BUILD_DIR=bin
BUILD_PATH="./${BUILD_DIR}"
# used in developmnet mode
# BUILD_PATH="/tmp/${BUNDLE_DIR}"
BUNDLE_EXE="typescript-rest-actions-api-sample-app"
BUNDLE_DIR="${BUNDLE_EXE}"
TARGET_PATH="/usr/share/${BUNDLE_DIR}"
PASSWORD="root"
SERVICE_NAME="${BUNDLE_EXE}"
MONIT_NAME="${BUNDLE_EXE}"
MONIT_NAME="${BUNDLE_EXE}"
ENTRYPOINT_FILE="dist/server.js"
PROJECT_FILES=( prod.env )
PROJECT_DIRS=( config )
RUN_LOCAL=$(cat <<-END
#!/bin/bash
set -o allexport
source .env
set +o allexport
./${BUNDLE_EXE}
END
)

if ! [ -x "$(command -v ${NEXE_BIN})" ]; then
  echo "this scripts require ${NEXE_BIN} to run, to install use 'npm i nexe -g'" >&2
  exit 1
fi

# always remove bundle path, in case build fails, we don't get folled by a old bin
rm $BUILD_PATH -r
# create bundle path
mkdir $BUILD_PATH -p

# bundle app
echo "start bundling app to ${BUILD_PATH}"

echo "build dist folder"
npm run build-ts

echo "bundle ${BUNDLE_EXE} binary"
$NEXE_BIN --build -t linux-x64 -o ${BUILD_PATH}/${BUNDLE_EXE} ${ENTRYPOINT_FILE}

# create test run.sh script
echo "${RUN_LOCAL}" > "${BUILD_PATH}/runLocal.sh"

# copy files/dirs
echo "start copying file(s) to ${BUILD_PATH}"

for i in "${PROJECT_FILES[@]}"
do
  CMD="cp ${i} ${BUILD_PATH}"
  # echo $CMD
  echo "  copying project file ${i} to ${BUILD_PATH}"
  $CMD
done

for i in "${PROJECT_DIRS[@]}"
do
  CMD="cp ${i} ${BUILD_PATH} -r"
  # echo $CMD
  echo "  copying project dir ${i} to ${BUILD_PATH}"
  $CMD
done

mkdir "${BUILD_PATH}/build" -p
for i in "${BUILD_FILES[@]}"
do
  CMD="cp ${i} ${BUILD_PATH}/build -r"
  # echo $CMD
  echo "  copying build file ${i} to ${BUILD_PATH}/build"
  $CMD
done

for i in "${NATIVE_FILES[@]}"
do
  CMD="cp ${i} ${BUILD_PATH} -r"
  # echo $CMD
  echo "  copying native file ${i} to ${BUILD_PATH}"
  $CMD
done

# rename .env file
mv "${BUILD_PATH}/prod.env" "${BUILD_PATH}/.env"

# running with env-cmd to have access to .env file
echo "done!"
echo ""
echo "to run/test with local bin runLocal.sh:"
echo " cd ${BUILD_PATH} && source runLocal.sh && cd .."
echo ""
echo "to run/test in remote c3 runRemote.sh:"
echo " cd ${BUILD_PATH} && source runRemote.sh && cd .."
