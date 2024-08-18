default: data assets
  cd pack && packwiz refresh

clean:
  rm -rf .build_* pack/kubejs/data/data.zip pack/kubejs/assets/assets.zip pack/kubejs/{client_scripts,server_scripts,startup_scripts}/*.js

assets: clean
  #!/usr/bin/env sh
  mkdir -p .build_assets
  rm -rf .build_assets/*
  fetch_unpack () { curl -sSL "$1" -o /tmp/temp_output.zip && unzip -q -o /tmp/temp_output.zip -d .build_assets; }
  fetch_unpack "https://vanillatweaks.net$(curl https://vanillatweaks.net/assets/server/zipresourcepacks.php -X POST -F "packs=$(jq -c . < src/vanillatweaks.json)" -F version=1.19 | jq -r .link)"
  fetch_unpack "https://mediafilez.forgecdn.net/files/4331/757/Create%20Style%20Modded%20Compats%20v16.zip"
  fetch_unpack "https://cdn-raw.modrinth.com/data/KqGEAQeu/versions/vb1TD308/ComputerCreate.zip"
  fetch_unpack "https://mediafilez.forgecdn.net/files/4559/986/Create%20Simple%20Storage%202.1.zip"
  fetch_unpack "https://mediafilez.forgecdn.net/files/4684/561/Lopy-Create-Sophisticated-Backpacks.zip"
  fetch_unpack "https://mediafilez.forgecdn.net/files/4496/761/Stronk%20Golems%202.zip"
  fetch_unpack "https://cdn.modrinth.com/data/FvdUXxVO/versions/cQUZ60KF/BOP_Renewed_v1.6.zip"
  fetch_unpack "https://mediafilez.forgecdn.net/files/4974/380/v2_REFRESH_Building_Gadgets_Create_Like.zip"
  fetch_unpack "https://mediafilez.forgecdn.net/files/3837/56/Better-Leaves-7.1-1.19%2B.zip"
  fetch_unpack "https://cdn.modrinth.com/data/9fYTRFXX/versions/YhHt77AV/Create%20New%20Age%20Retexture.zip"

  # derived assets
  mkdir -p .build_assets/assets/{create,createaddition,createdeco}/textures/item
  colorize_texture() { magick ".build_assets/assets/$(echo "$1" | cut -d: -f1)/textures/$3/$(echo "$1" | cut -d: -f2).png" -colorspace gray -fill "$4" -tint 100 ".build_assets/assets/$(echo "$2" | cut -d: -f1)/textures/$3/$(echo "$2" | cut -d: -f2).png"; }
  shade_texture() { magick ".build_assets/assets/$(echo "$1" | cut -d: -f1)/textures/$3/$(echo "$1" | cut -d: -f2).png" -colorspace gray -fill "$4" -colorize "50%" -tint 100 ".build_assets/assets/$(echo "$2" | cut -d: -f1)/textures/$3/$(echo "$2" | cut -d: -f2).png"; }
  generate_full_crystal() { sed -e "s/block\/amethyst_cluster/$(echo "$1" | cut -d: -f1):block\/$(echo "$1" | cut -d: -f2)/g" < .build_assets/assets/minecraft/models/block/amethyst_cluster.json > ".build_assets/assets/$(echo "$1" | cut -d: -f1)/models/block/$(echo "$1" | cut -d: -f2).json"; }
  colorize_texture "minecraft:copper_ingot" "create:zinc_ingot" "item" "rgb(185,233,193)"
  colorize_texture "minecraft:copper_ingot" "create:brass_ingot" "item" "rgb(225,193,110)"
  shade_texture "minecraft:copper_ingot" "createdeco:industrial_iron_ingot" "item" "black"
  colorize_texture "minecraft:amethyst_cluster_dfx" "biomesoplenty:rose_quartz_cluster_dfx" "block" "rgb(255,57,135)"
  colorize_texture "minecraft:amethyst_cluster_dfx" "quark:blue_corundum_cluster_dfx" "block" "rgb(8,133,175)"
  generate_full_crystal "quark:blue_corundum_cluster"
  colorize_texture "minecraft:amethyst_cluster_dfx" "quark:indigo_corundum_cluster_dfx" "block" "rgb(37,49,147)"
  generate_full_crystal "quark:indigo_corundum_cluster"
  colorize_texture "minecraft:amethyst_cluster_dfx" "quark:violet_corundum_cluster_dfx" "block" "rgb(168,1,135)"
  generate_full_crystal "quark:violet_corundum_cluster"
  colorize_texture "minecraft:amethyst_cluster_dfx" "quark:green_corundum_cluster_dfx" "block" "rgb(57,186,46)"
  generate_full_crystal "quark:green_corundum_cluster"
  colorize_texture "minecraft:amethyst_cluster_dfx" "quark:yellow_corundum_cluster_dfx" "block" "rgb(194,181,28)"
  generate_full_crystal "quark:yellow_corundum_cluster"
  colorize_texture "minecraft:amethyst_cluster_dfx" "quark:orange_corundum_cluster_dfx" "block" "rgb(234,126,53)"
  generate_full_crystal "quark:orange_corundum_cluster"
  colorize_texture "minecraft:amethyst_cluster_dfx" "quark:red_corundum_cluster_dfx" "block" "rgb(158,43,39)"
  generate_full_crystal "quark:red_corundum_cluster"
  shade_texture "minecraft:amethyst_cluster_dfx" "quark:white_corundum_cluster_dfx" "block" "white"
  generate_full_crystal "quark:white_corundum_cluster"
  shade_texture "minecraft:amethyst_cluster_dfx" "quark:black_corundum_cluster_dfx" "block" "black"
  generate_full_crystal "quark:black_corundum_cluster"
  sed -e 's/block\/amethyst_cluster_dfx/biomesoplenty:block\/rose_quartz_cluster_dfx/g' -e 's/block\/amethyst_cluster/quark:block\/violet_corundum/g' < .build_assets/assets/minecraft/models/block/amethyst_cluster.json > .build_assets/assets/biomesoplenty/models/block/rose_quartz_cluster.json
  sed -e 's/block\/amethyst_cluster_dfx/biomesoplenty:block\/rose_quartz_cluster_dfx/g' -e 's/block\/amethyst_cluster/quark:block\/violet_corundum/g' < .build_assets/assets/minecraft/models/block/large_amethyst_bud.json > .build_assets/assets/biomesoplenty/models/block/large_rose_quartz_bud.json
  sed -e 's/block\/amethyst_cluster_dfx/biomesoplenty:block\/rose_quartz_cluster_dfx/g' -e 's/block\/amethyst_cluster/quark:block\/violet_corundum/g' < .build_assets/assets/minecraft/models/block/medium_amethyst_bud.json > .build_assets/assets/biomesoplenty/models/block/medium_rose_quartz_bud.json
  sed -e 's/block\/amethyst_cluster_dfx/biomesoplenty:block\/rose_quartz_cluster_dfx/g' -e 's/block\/amethyst_cluster/quark:block\/violet_corundum/g' < .build_assets/assets/minecraft/models/block/small_amethyst_bud.json > .build_assets/assets/biomesoplenty/models/block/small_rose_quartz_bud.json
  for ogg in .build_assets/assets/minecraft/sounds/mob/irongolem/*.ogg
  do
    ffmpeg -hide_banner -loglevel error -i "$ogg" -f wav /tmp/temp_input.wav
    rubberband --pitch -10 --time 1.5 /tmp/temp_input.wav /tmp/temp_output.wav
    ffmpeg -hide_banner -loglevel error -y -i /tmp/temp_output.wav "$ogg"
    rm /tmp/temp_input.wav /tmp/temp_output.wav
  done

  # reset back to default
  rm -rf \
    .build_assets/assets/biomesoplenty/blockstates/rainbow_birch_leaves.json \
    .build_assets/assets/toms_storage/textures/gui/

  # extra files
  rm -rf \
    .build_assets/assets/minecraft/Nothing\ in\ here\ silly.txt \
    .build_assets/Replace_Packpng_to_whatever.txt \
    .build_assets/Selected\ Packs.txt \
    .build_assets/pack.* \
    .build_assets/LICENSE \
    .build_assets/assets/{aurorasdeco,betterdefaultbiomes,betterend,betterendforge,betternether,biomemakeover,bloomful,byg,crimson,croptopia,druidcraft,dungeons,environmental,integrateddynamics,lint,luminiferous_uplands,mubble,newlands,queks_end,swampexpansion,techreborn,terrestria,the_aether,traverse,upgradeaquatics,wild_explorer,woods_and_mires,immersive_aircraft,redstonepen,mobcompack}
  
  # add in custom assets
  cp -r src/assets .build_assets

  # generate meta
  echo '{"pack":{"pack_format":15,"description":"test_pack"}}' > .build_assets/pack.mcmeta

  # package
  find .build_assets -name "*.json" -exec sh -c 'jq -c . "$1" > /tmp/minify.json; cp /tmp/minify.json "$1"; rm /tmp/minify.json' _ {} \;
  cd .build_assets && zip -q -r ../pack/kubejs/assets/assets.zip .

data: clean
  #!/usr/bin/env sh
  mkdir -p .build_data
  rm -rf .build_data/*
  fetch_unpack () { curl -sSL "$1" -o /tmp/temp_output.zip && unzip -q -o /tmp/temp_output.zip -d .build_data; }
  fetch_unpack "https://cdn.modrinth.com/data/WAKcNdAc/versions/MRJuKyja/Skylands_Over_The_Sea_v1.2.0.zip"
  fetch_unpack "https://mediafilez.forgecdn.net/files/4849/958/SkyVillages-FarmersDelightCompat-1.20.1-1.0.3.zip"
  fetch_unpack "https://mediafilez.forgecdn.net/files/4796/879/SkyVillages-SupplementariesCompat-1.20.1-1.0.3.1.zip"

  # derived data
  mkdir -p .build_data/data/custom_compat/lithostitched/worldgen_modifier/
  jq --argjson lithostitched '{"type": "lithostitched:add_surface_rule","levels":["minecraft:overworld"]}' '$ARGS.named.lithostitched + {surface_rule: .surface_rule}' < .build_data/data/minecraft/worldgen/noise_settings/overworld.json > .build_data/data/custom_compat/lithostitched/worldgen_modifier/surface_rules.json

  # extra files
  rm -rf \
    .build_data/pack.* \
    .build_data/LICENSE.txt
  
  # add in custom assets
  cp -r src/data .build_data
  uglifyjs < src/client.js > pack/kubejs/client_scripts/client.js
  uglifyjs < src/server.js > pack/kubejs/server_scripts/server.js
  uglifyjs < src/startup.js > pack/kubejs/startup_scripts/startup.js

  # generate meta
  echo '{"pack":{"pack_format":15,"description":"test_pack"}}' > .build_data/pack.mcmeta

  # package
  find .build_data -name "*.json" -exec sh -c 'jq -c . "$1" > /tmp/minify.json; cp /tmp/minify.json "$1"; rm /tmp/minify.json' _ {} \;
  cd .build_data && zip -q -r ../pack/kubejs/data/data.zip .
